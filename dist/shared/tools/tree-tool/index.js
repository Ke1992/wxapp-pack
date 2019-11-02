"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 库
const _ = require("lodash");
const path = require("path");
// 自己的库
const JsAstTool_1 = require("./JsAstTool");
// 变量
const visited = {};
let wxsFiles;
/**
 * 依赖分析树工具类
 */
class TreeTool {
    /**
     * AST树展开成数组
     */
    static toList(entry) {
        // 校验空值
        if (_.isEmpty(entry)) {
            return [];
        }
        // 获取AST树
        const data = TreeTool.init(entry);
        // 展开AST树
        const result = TreeTool.formatTreeToArray(data.tree);
        // 返回数据
        return [...result].concat(...data.wxs);
    }
    // ------------------------------私有函数------------------------------
    /**
     * 根据入口解析AST树
     * @param entry [入口路径]
     */
    static init(entry) {
        // 重置数据
        wxsFiles = new Set();
        // 开始解析依赖树
        return {
            wxs: wxsFiles,
            tree: TreeTool.getAstTree(entry),
        };
    }
    /**
     * 获取AST树
     * @param entry [入口路径]
     */
    static getAstTree(entry) {
        // 获取后缀
        const ext = path.extname(entry);
        // 解析JS
        if (ext === '.js') {
            return {
                [entry]: JsAstTool_1.default.getAst(entry, visited, wxsFiles),
            };
        }
        // 兜底
        return {};
    }
    /**
     * 将AST展开成数组
     * @param source [AST数据源]
     */
    static formatTreeToArray(source) {
        const result = new Set();
        // 遍历获取
        _.forEach(source, (value, key) => {
            result.add(key);
            // 递归
            TreeTool.formatTreeToArray(value).forEach((item) => {
                result.add(item);
            });
        });
        return result;
    }
}
exports.default = TreeTool;
