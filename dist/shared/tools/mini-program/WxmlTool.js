"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 库
const path = require("path");
const fs = require("fs-extra");
// 自己的库
const FileTool_1 = require("../FileTool");
const tree_tool_1 = require("../tree-tool");
const PromptTool_1 = require("../PromptTool");
const ProgressTool_1 = require("../ProgressTool");
/**
 * WXML文件工具类
 */
class WxmlTool {
    /**
     * 获取文件
     * @param result [编译结果对象]
     */
    static getFiles(result) {
        // 提示
        PromptTool_1.default.info('开始解析WXML');
        // 开始解析wxml
        WxmlTool.analyze(result);
        // 停止进度条
        ProgressTool_1.default.stop();
    }
    // ------------------------------私有函数------------------------------
    /**
     * 分析文件
     * @param result [编译结果对象]
     */
    static analyze({ jsFiles, wxsFiles, wxmlFiles, invalidFiles, }) {
        // 所有待分析的入口
        const entry = new Set();
        // 遍历获取所有wxml文件
        jsFiles.forEach((item) => {
            const filePath = FileTool_1.default.replaceExt(item, '.wxml');
            // 检查wxml文件是否存在
            fs.existsSync(filePath) && entry.add(filePath);
        });
        // 初始化进度条
        ProgressTool_1.default.init({
            prefix: 'WXML',
            total: entry.size,
        });
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
                    wxmlFiles.add(filePath);
                }
            });
            // 更新进度
            ProgressTool_1.default.update();
        });
    }
}
exports.default = WxmlTool;
