// 库
import * as fs from 'fs-extra';
import * as decomment from 'decomment';
import * as htmlparser2 from 'htmlparser2';
// 自己的库
import AstBase from './AstBase';
// 定义
import {
    TreeItem,
} from '../../interface';
// 变量
const visited: TreeItem = {};

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

        // 获取文件内容
        const content = fs.readFileSync(filePath, 'utf8');
        // 开始解析wxml
        const parser = new htmlparser2.Parser({
            onopentag(name, { src }): void {
                if (name === 'wxs' || name === 'import' || name === 'include') {
                    // 值存在才加入结果
                    src && result.add(src);
                }
            },
        }, {
            // 官方文档建议始终开启（https://github.com/fb55/htmlparser2/wiki/Parser-options）
            decodeEntities: true,
        });
        parser.write(content);
        parser.end();
        // 返回结果
        return [...result];
    }
}
