"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 库
const fs = require("fs-extra");
const postcss = require("postcss");
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
        WxssAstTool.getDependency(entry).forEach((item) => {
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
    /**
     * 删除注释
     * @param wxss [待删除注释的wxss代码]
     */
    static removeComment(wxss) {
        // 先格式化一次，再解析成ast树
        const ast = postcss.parse(wxss);
        // 遍历注释并删除
        ast.walkComments((comment) => {
            comment.remove();
        });
        // 返回删除后的代码
        return ast.toString();
    }
    // ------------------------------私有函数------------------------------
    /**
     * 获取依赖文件
     * @param filePath [文件路径]
     */
    static getDependency(filePath) {
        // 包含wxs文件的结果
        const result = new Set();
        // 如果文件不存在，则直接返回空
        if (!fs.existsSync(filePath)) {
            return [];
        }
        // 获取文件内容
        const content = fs.readFileSync(filePath, 'utf8');
        // 生成ast树
        const ast = postcss.parse(content);
        // 遍历import声明
        ast.walkAtRules('import', (rule) => {
            const src = rule.params.slice(1, -1);
            // 值存在才加入结果
            src && result.add(src);
        });
        // 返回结果
        return [...result];
    }
}
exports.default = WxssAstTool;
