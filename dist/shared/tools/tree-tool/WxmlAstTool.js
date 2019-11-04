"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 库
const path = require("path");
// 自己的库
const AstBase_1 = require("./AstBase");
/**
 * WXML AST解析工具类
 */
class WxmlAstTool extends AstBase_1.default {
    /**
     * 获取AST树
     * @param entry [入口路径]
     */
    static getAst(entry, cache, wxsFiles) {
        const visited = cache;
        const result = {};
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
exports.default = WxmlAstTool;
