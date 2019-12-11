// 库
import {
    StringLiteral,
    CallExpression,
} from '@babel/types';
import * as _ from 'lodash';
import * as fs from 'fs-extra';
import * as terser from 'terser';
import traverse from '@babel/traverse';
import * as parser from '@babel/parser';
// 自己的库
import AstBase from './AstBase';
// 定义
import {
    TreeItem,
    TerserConfig,
    AnalyseGraph,
} from '../../interface';
// 变量
const visited: TreeItem = {};
const graph: AnalyseGraph = {};

/**
 * JS AST解析工具类
 */
export default class JsAstTool extends AstBase {
    /**
     * 获取AST树
     * @param entry    [入口路径]
     * @param wxsFiles [.wxs文件]
     */
    public static getAst(entry: string, wxsFiles: Set<string>): TreeItem {
        const result: TreeItem = {};

        // 获取解析结果
        const source = JsAstTool.getDependency(entry);
        // 缓存解析结果
        graph[entry] = JsAstTool.formatGraphData(entry, source, 'js');

        // 过滤.wxs文件
        JsAstTool.filterWxsFiles(entry, source, wxsFiles).forEach((item) => {
            const filePath = JsAstTool.formatFilePath(item, entry, 'js');

            // 缓存中不存在，则进行递归
            if (!visited[filePath]) {
                // TODO: 怎么解决死循环的问题，暂时全部都先用空对象来解决
                visited[filePath] = {};
                visited[filePath] = JsAstTool.getAst(filePath, wxsFiles);
            }

            // 赋值
            result[filePath] = visited[filePath];
        });

        return result;
    }

    /**
     * 删除注释
     * @param js           [待删除注释的js代码]
     * @param terserConfig [JS压缩配置]
     */
    public static removeComment(js: string, terserConfig: TerserConfig): string {
        // 压缩代码
        const {
            code,
            error,
        } = terser.minify(js, terserConfig);

        // 如果出现异常，直接抛出
        if (error) {
            throw error;
        }

        return code;
    }

    /**
     * 获取依赖文件
     * @param filePath [文件路径]
     */
    public static getDependency(filePath: string): string[] {
        // 如果文件不存在，则直接返回空
        if (!fs.existsSync(filePath)) {
            return [];
        }

        // 获取文件内容
        const content = fs.readFileSync(filePath, 'utf8');

        // 根据内容获取依赖文件
        return JsAstTool.getDependencyByContent(content);
    }

    /**
     * 根据内容获取依赖文件
     * @param content [文本内容]
     */
    public static getDependencyByContent(content: string): string[] {
        // 包含wxs文件的结果
        const result = new Set<string>();

        // 内容为空则直接返回空
        if (_.isEmpty(content)) {
            return [];
        }

        // 生成AST树
        const ast = parser.parse(content, {
            allowImportExportEverywhere: true, // 允许import和export出现在任意地方
        });
        // 遍历AST树
        traverse(ast, {
            // 参考precinct库中的detective-es库（https://github.com/dependents/node-detective-es6）
            ImportDeclaration({ node }) {
                if (node.importKind === 'type') {
                    return;
                }
                // 对应引用存在才加入结果
                node.source && node.source.value && result.add(node.source.value);
            },
            ExportAllDeclaration({ node }) {
                // 对应引用存在才加入结果
                node.source && node.source.value && result.add(node.source.value);
            },
            ExportNamedDeclaration({ node }) {
                // 对应引用存在才加入结果
                node.source && node.source.value && result.add(node.source.value);
            },
            CallExpression({ node }) {
                // 对应引用存在才加入结果
                // 该分支属于动态引入import，后续如果需要开启则启用babel以下配置
                // plugins: [
                //     'dynamicImport'
                // ],
                node.callee.type === 'Import' && node.arguments.length && result.add((node.arguments[0] as StringLiteral).value);
            },
            // 参考precinct库中的detective-cjs库（https://github.com/dependents/node-detective-cjs）
            Identifier(nodePath) {
                if (nodePath.node.name === 'require') {
                    const parent = nodePath.parent as CallExpression;

                    // 如果类型不等于CallExpression则直接返回
                    if (parent.type !== 'CallExpression') {
                        return;
                    }

                    const {
                        value,
                    } = parent.arguments[0] as StringLiteral;

                    // 值存在才加入结果
                    value && result.add(value);
                } else if (nodePath.node.name === 'createWorker') {
                    // 处理小程序的worker场景
                    if (nodePath.parentPath && nodePath.parentPath.parent) {
                        // 获取祖先节点
                        const ancestor = nodePath.parentPath.parent as CallExpression;

                        // 如果类型不等于CallExpression则直接返回
                        if (ancestor.type !== 'CallExpression') {
                            return;
                        }

                        const {
                            value,
                        } = ancestor.arguments[0] as StringLiteral;

                        // 值存在才加入结果（必须保证是根目录，因为小程序要求必须是根目录）
                        value && result.add(`/${value}`);
                    }
                }
            },
        });

        // 返回结果
        return [...result];
    }

    /**
     * 获取模块依赖关系
     */
    public static getGraph(): AnalyseGraph {
        return graph;
    }
}
