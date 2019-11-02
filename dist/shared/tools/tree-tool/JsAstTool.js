"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 库
const path = require("path");
// 自己的库
const AstBase_1 = require("./AstBase");
/**
 * JS AST解析工具类
 */
class JsAstTool extends AstBase_1.default {
    /**
     * 获取AST树
     * @param entry [入口路径]
     */
    static getAst(entry, cache, wxsFiles) {
        const visited = cache;
        const result = {};
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
exports.default = JsAstTool;
