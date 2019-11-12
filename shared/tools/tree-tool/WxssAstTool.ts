// 库
import * as postcss from 'postcss';
// 自己的库
import AstBase from './AstBase';
// 定义
import {
    TreeItem,
} from '../../interface';

/**
 * WXSS AST解析工具类
 */
export default class WxssAstTool extends AstBase {
    /**
     * 获取AST树
     * @param entry    [入口路径]
     * @param cache    [解析结果缓存]
     */
    public static getAst(entry: string, cache: TreeItem): TreeItem {
        const visited = cache;
        const result: TreeItem = {};

        // 解析wxss文件
        WxssAstTool.getDependencyFromPrecinct(entry, 'css').forEach((item) => {
            const filePath = WxssAstTool.formatFilePath(item, entry, 'wxss');

            // 缓存中不存在，则进行递归
            if (!visited[filePath]) {
                visited[filePath] = {};
                visited[filePath] = WxssAstTool.getAst(filePath, visited);
            }

            // 赋值
            result[filePath] = visited[filePath];
        });

        return result;
    }

    /**
     * 删除注释
     * @param wxss [待删除注释的wxss代码]
     */
    public static removeComment(wxss: string): string {
        // 先格式化一次，再解析成ast树
        const ast = postcss.parse(wxss);
        // 遍历注释并删除
        ast.walkComments((comment) => {
            comment.remove();
        });
        // 返回删除后的代码
        return ast.toString();
    }
}
