"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 库
const terser = require("terser");
// 自己的库
const AstBase_1 = require("./AstBase");
/**
 * JS AST解析工具类
 */
class JsAstTool extends AstBase_1.default {
    /**
     * 获取AST树
     * @param entry    [入口路径]
     * @param cache    [解析结果缓存]
     * @param wxsFiles [.wxs文件]
     */
    static getAst(entry, cache, wxsFiles) {
        const visited = cache;
        const result = {};
        // 获取解析结果
        const source = JsAstTool.getDependencyFromPrecinct(entry, 'es6');
        // 过滤.wxs文件
        JsAstTool.filterWxsFiles(entry, source, wxsFiles).forEach((item) => {
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
    /**
     * 删除注释
     * @param js           [待删除注释的js代码]
     * @param terserConfig [JS压缩配置]
     */
    static removeComment(js, terserConfig) {
        // 压缩代码
        const { code, error, } = terser.minify(js, terserConfig);
        // 如果出现异常，直接抛出
        if (error) {
            throw error;
        }
        return code;
    }
}
exports.default = JsAstTool;
