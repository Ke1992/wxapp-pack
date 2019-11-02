// 库
import * as path from 'path';
// 自己的库
import AstBase from './AstBase';
// 定义
import {
    TreeItem,
} from '../../interface';

/**
 * JS AST解析工具类
 */
export default class JsAstTool extends AstBase {
    /**
     * 获取AST树
     * @param entry [入口路径]
     */
    public static getAst(entry: string, cache: TreeItem, wxsFiles: Set<string>): TreeItem {
        const visited = cache;
        const result: TreeItem = {};

        // 遍历所有文件
        JsAstTool.getDependencyFromPrecinct(entry, 'es6').filter((item) => {
            // 获取文件后缀
            const ext = path.extname(item);

            // 后缀是wxs，就加入gWxsResult
            ext === '.wxs' && wxsFiles.add(JsAstTool.formatFilePath(item, entry, 'wxs'));

            return ext !== '.wxs';
        }).forEach((item) => {
            const filePath = JsAstTool.formatFilePath(item, entry, 'js');

            // 缓存中不存在，则进行递归
            if (!visited[filePath]) {
                // TODO: 怎么解决死循环的问题，暂时全部都先用空对象来解决
                visited[filePath] = {};
                visited[filePath] = JsAstTool.getAst(filePath, visited, wxsFiles);
            }

            // 赋值
            result[filePath] = visited[filePath];
        });

        return result;
    }
}
