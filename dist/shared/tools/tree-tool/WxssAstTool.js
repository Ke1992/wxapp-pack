"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 自己的库
const AstBase_1 = require("./AstBase");
/**
 * WXSS AST解析工具类
 */
class WxssAstTool extends AstBase_1.default {
    /**
     * 获取AST树
     * @param entry    [入口路径]
     * @param cache    [解析结果缓存]
     */
    static getAst(entry, cache) {
        const visited = cache;
        const result = {};
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
}
exports.default = WxssAstTool;
