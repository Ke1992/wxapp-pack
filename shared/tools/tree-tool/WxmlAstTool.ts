// 库
import * as path from 'path';
// 自己的库
import AstBase from './AstBase';
// 定义
import {
    TreeItem,
} from '../../interface';

/**
 * WXML AST解析工具类
 */
export default class WxmlAstTool extends AstBase {
    /**
     * 获取AST树
     * @param entry    [入口路径]
     * @param cache    [解析结果缓存]
     * @param wxsFiles [.wxs文件]
     */
    public static getAst(entry: string, cache: TreeItem, wxsFiles: Set<string>): TreeItem {
        const visited = cache;
        const result: TreeItem = {};

        // 获取解析结果
        const source = WxmlAstTool.getDependencyFromCheerio(entry);

        // 过滤.wxs文件
        WxmlAstTool.filterWxsFiles(entry, source, wxsFiles).forEach((item) => {
            const filePath = WxmlAstTool.formatFilePath(item, entry, 'wxml');

            // 缓存中不存在，则进行递归
            if (!visited[filePath]) {
                visited[filePath] = {};
                visited[filePath] = WxmlAstTool.getAst(filePath, visited, wxsFiles);
            }

            // 赋值
            result[filePath] = visited[filePath];
        });

        return result;
    }
}
