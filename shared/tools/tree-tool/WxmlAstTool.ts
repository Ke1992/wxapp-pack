// 库
import {
    Node,
    DataNode,
} from 'domhandler';
import * as _ from 'lodash';
import * as fs from 'fs-extra';
import * as parse5 from 'parse5';
import * as decomment from 'decomment';
import * as htmlparser2 from 'htmlparser2';
import * as htmlparser2Adapter from 'parse5-htmlparser2-tree-adapter';
// 自己的库
import AstBase from './AstBase';
import JsAstTool from './JsAstTool';
// 定义
import {
    TreeItem,
    AnalyseGraph,
} from '../../interface';
// 变量
const visited: TreeItem = {};
const graph: AnalyseGraph = {};

/**
 * WXML AST解析工具类
 */
export default class WxmlAstTool extends AstBase {
    /**
     * 获取AST树
     * @param entry    [入口路径]
     * @param wxsFiles [.wxs文件]
     */
    public static getAst(entry: string, wxsFiles: Set<string>): TreeItem {
        const result: TreeItem = {};

        // 获取解析结果
        const source = WxmlAstTool.getDependency(entry);
        // 缓存解析结果
        graph[entry] = WxmlAstTool.formatGraphData(entry, source, 'wxml');

        // 过滤.wxs文件
        WxmlAstTool.filterWxsFiles(entry, source, wxsFiles).forEach((item) => {
            const filePath = WxmlAstTool.formatFilePath(item, entry, 'wxml');

            // 缓存中不存在，则进行递归
            if (!visited[filePath]) {
                visited[filePath] = {};
                visited[filePath] = WxmlAstTool.getAst(filePath, wxsFiles);
            }

            // 赋值
            result[filePath] = visited[filePath];
        });

        return result;
    }

    /**
     * 删除注释
     * @param wxml [待删除注释的wxml代码]
     */
    public static removeComment(wxml: string): string {
        // 返回删除后的代码
        return decomment.html(wxml);
    }

    /**
     * 获取模块依赖关系
     */
    public static getGraph(): AnalyseGraph {
        return graph;
    }

    // ------------------------------私有函数------------------------------
    /**
     * 获取依赖文件
     * @param filePath [文件路径]
     */
    private static getDependency(filePath: string): string[] {
        // 包含wxs文件的结果
        const result = new Set<string>();

        // 如果文件不存在，则直接返回空
        if (!fs.existsSync(filePath)) {
            return [];
        }

        // 是否继续解析wxs节点
        let isContinue = false;
        // 获取文件内容
        const content = fs.readFileSync(filePath, 'utf8');
        // 开始解析wxml
        const parser = new htmlparser2.Parser({
            onopentag(name, { src }): void {
                if (name === 'wxs' || name === 'import' || name === 'include') {
                    // 值存在才加入结果
                    if (src) {
                        result.add(src);
                    } else {
                        // 设置标记为需要继续解析内嵌的wxs
                        isContinue = true;
                    }
                }
            },
        }, {
            // 官方文档建议始终开启（https://github.com/fb55/htmlparser2/wiki/Parser-options）
            decodeEntities: true,
        });
        parser.write(content);
        parser.end();

        // 继续解析内嵌的wxs
        isContinue && WxmlAstTool.getInnerWxsDependency(content, result);

        // 返回结果
        return [...result];
    }

    /**
     * 解析内嵌的wxs
     * @param content [当前wxml的文本内容]
     * @param result  [当前wxml的解析结果]
     */
    private static getInnerWxsDependency(content: string, result: Set<string>): void {
        // 将文本解析成ast树（使用parse5的原因是htmlparser2无法处理wxml内嵌wxs包含 <= 的情况）
        const nodes: Node = parse5.parse(content, {
            treeAdapter: htmlparser2Adapter,
        }) as Node;
        // 第三个参数为是否递归
        htmlparser2.DomUtils.getElementsByTagName('wxs', nodes, true).forEach((node) => {
            const {
                src,
            } = node.attribs;

            // src属性为空 && module属性存在
            if (_.isEmpty(src) && !_.isEmpty(node.attribs.module)) {
                // 获取字节点
                const children = node.children[0];

                // 只包含一个子节点 && 子节点是文本类型，则需要进行解析
                if (node.children.length === 1 && children.type === 'text') {
                    // 获取文本内容
                    const {
                        data,
                    } = children as DataNode;

                    // 解析wxs内容
                    JsAstTool.getDependencyByContent(data).forEach((item) => {
                        result.add(item);
                    });
                }
            }
        });
    }
}
