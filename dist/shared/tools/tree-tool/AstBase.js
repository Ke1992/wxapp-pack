"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 库
const _ = require("lodash");
const path = require("path");
// 自己的库
const FileTool_1 = require("../FileTool");
/**
 * 依赖分析树基础类
 */
class AstBase {
    /**
     * 过滤.wxs文件
     * @param entry    [入口路径]
     * @param source   [根据入口路径解析的结果]
     * @param wxsFiles [.wxs文件]
     */
    static filterWxsFiles(entry, source, wxsFiles) {
        return source.filter((item) => {
            // 获取文件后缀
            const ext = path.extname(item);
            // 后缀是wxs，就加入wxsFiles
            ext === '.wxs' && wxsFiles.add(AstBase.formatFilePath(item, entry, 'wxs'));
            return ext !== '.wxs';
        });
    }
    /**
     * 格式化文件路径
     * @param source [待格式化的路径]
     * @param entry  [入口文件路径]
     * @param type   [文件类型]
     */
    static formatFilePath(source, entry, type) {
        // 获取绝对路径
        let result = FileTool_1.default.getAbsolutePath(entry, source);
        // 获取后缀
        const ext = path.extname(result);
        // 没有后缀则补全
        if (_.isEmpty(ext)) {
            result += `.${type}`;
        }
        else if (type === 'js' && ext !== '.js' && ext !== '.json') {
            // 兼容.min类似的情况
            // TODO: 这里这样替换是否可能存在隐患？
            result += `.${type}`;
        }
        // 返回结果
        return result;
    }
}
exports.default = AstBase;
