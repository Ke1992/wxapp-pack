"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 库
const generator_1 = require("@babel/generator");
const parser = require("@babel/parser");
// 自己的库
const AstBase_1 = require("./AstBase");
/**
 * WXS AST解析工具类
 */
class WxsAstTool extends AstBase_1.default {
    /**
     * 获取AST树
     * @param entry [入口路径]
     * @param cache [解析结果缓存]
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
    /**
     * 删除注释
     * @param wxs                  [待删除注释的wxss代码]
     * @param babelGeneratorConfig [babel压缩配置]
     */
    static removeComment(wxs, babelGeneratorConfig) {
        // 生成AST树
        const ast = parser.parse(wxs, {
            allowImportExportEverywhere: true,
        });
        const { code, } = generator_1.default(ast, babelGeneratorConfig);
        return code;
    }
}
exports.default = WxsAstTool;
