"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 自己的库
const AstBase_1 = require("./AstBase");
/**
 * WXML AST解析工具类
 */
class WxsAstTool extends AstBase_1.default {
    /**
     * 获取AST树
     * @param entry    [入口路径]
     * @param cache    [解析结果缓存]
     */
    static getAst(entry, cache) {
        const visited = cache;
        const result = {};
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
exports.default = WxsAstTool;
