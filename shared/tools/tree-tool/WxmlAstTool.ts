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
     * @param entry [入口路径]
     */
    public static getAst(entry: string, cache: TreeItem, wxsFiles: Set<string>): TreeItem {
        const visited = cache;
        const result: TreeItem = {};

        // 解析wxml文件
        WxmlAstTool.getDependencyFromCheerio(entry).filter((item) => {
            // 获取文件后缀
            const ext = path.extname(item);

            // 后缀是wxs，就加入wxsFiles
            ext === '.wxs' && wxsFiles.add(WxmlAstTool.formatFilePath(item, entry, 'wxs'));

            return ext !== '.wxs';
        }).forEach((item) => {
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
