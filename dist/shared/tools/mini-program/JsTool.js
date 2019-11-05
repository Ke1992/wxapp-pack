"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 库
const path = require("path");
// 自己的库
const JsonTool_1 = require("./JsonTool");
const FileTool_1 = require("../FileTool");
const tree_tool_1 = require("../tree-tool");
const PromptTool_1 = require("../PromptTool");
const ProgressTool_1 = require("../ProgressTool");
/**
 * JS文件工具类
 */
class JsTool {
    /**
     * 获取文件
     * @param entry  [分析入口路径]
     * @param result [编译结果对象]
     */
    static getFiles(entry, result) {
        // 提示
        PromptTool_1.default.info('开始解析JS和JSON');
        // 初始化进度条
        ProgressTool_1.default.init({
            prefix: 'JS和JSON',
            total: entry.size,
        });
        // 开始第一次解析JS
        const source = JsTool.analyze(entry, result, true);
        // 开始递归解析JSON和JS
        JsonTool_1.default.getFiles(source, result);
        // 停止进度条
        ProgressTool_1.default.stop();
    }
    /**
     * 分析文件
     * @param entry  [分析入口]
     * @param result [编译结果对象]
     */
    static analyze(entry, { jsFiles, wxsFiles, invalidFiles }, isInit = false) {
        const result = new Set();
        // 更新总量
        !isInit && ProgressTool_1.default.updateTotal(entry.size);
        // 遍历获取
        entry.forEach((item) => {
            // 获取依赖分析树
            tree_tool_1.default.toList(item).forEach((filePath) => {
                // 校验文件是否存在
                if (!FileTool_1.default.checkExists(item, filePath, invalidFiles)) {
                    return;
                }
                // 获取文件后缀
                const ext = path.extname(filePath);
                // 根据类型添加到对应的结果
                if (ext === '.wxs') {
                    wxsFiles.add(filePath);
                }
                else {
                    result.add(filePath);
                    jsFiles.add(filePath);
                }
            });
            // 更新进度
            ProgressTool_1.default.update();
        });
        return result;
    }
}
exports.default = JsTool;
