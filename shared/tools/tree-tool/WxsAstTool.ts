// 自己的库
import AstBase from './AstBase';
// 定义
import {
    TreeItem,
} from '../../interface';

/**
 * WXS AST解析工具类
 */
export default class WxsAstTool extends AstBase {
    /**
     * 获取AST树
     * @param entry [入口路径]
     * @param cache [解析结果缓存]
     */
    public static getAst(entry: string, cache: TreeItem): TreeItem {
        const visited = cache;
        const result: TreeItem = {};

        // 解析wxs文件
        WxsAstTool.getDependencyFromPrecinct(entry, 'commonjs').forEach((item) => {
            const filePath = WxsAstTool.formatFilePath(item, entry, 'wxs');

            // 缓存中不存在，则进行递归
            if (!visited[filePath]) {
                visited[filePath] = {};
                visited[filePath] = WxsAstTool.getAst(filePath, visited);
            }

            // 赋值
            result[filePath] = visited[filePath];
        });

        return result;
    }
}
