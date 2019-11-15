"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 库
const fs = require("fs-extra");
const decomment = require("decomment");
const htmlparser2 = require("htmlparser2");
// 自己的库
const AstBase_1 = require("./AstBase");
/**
 * WXML AST解析工具类
 */
class WxmlAstTool extends AstBase_1.default {
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
        const source = WxmlAstTool.getDependency(entry);
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
    /**
     * 删除注释
     * @param wxml [待删除注释的wxml代码]
     */
    static removeComment(wxml) {
        // 返回删除后的代码
        return decomment.html(wxml);
    }
    // ------------------------------私有函数------------------------------
    /**
     * 获取依赖文件
     * @param filePath [文件路径]
     */
    static getDependency(filePath) {
        // 包含wxs文件的结果
        const result = new Set();
        // 获取文件内容
        const content = fs.readFileSync(filePath, 'utf8');
        // 开始解析wxml
        const parser = new htmlparser2.Parser({
            onopentag(name, { src }) {
                if (name === 'wxs' || name === 'import' || name === 'include') {
                    // 值存在才加入结果
                    src && result.add(src);
                }
            },
        }, {
            // 官方文档建议始终开启（https://github.com/fb55/htmlparser2/wiki/Parser-options）
            decodeEntities: true,
        });
        parser.write(content);
        parser.end();
        // 返回结果
        return [...result];
    }
}
exports.default = WxmlAstTool;
