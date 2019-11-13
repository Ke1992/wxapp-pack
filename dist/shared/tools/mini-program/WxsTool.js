"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 库
const fs = require("fs-extra");
// 自己的库
const FileTool_1 = require("../FileTool");
const tree_tool_1 = require("../tree-tool");
const PromptTool_1 = require("../PromptTool");
const ProgressTool_1 = require("../ProgressTool");
/**
 * WXS文件工具类
 */
class WxsTool {
    /**
     * 获取文件
     * @param result [编译结果对象]
     */
    static getFiles(result) {
        // 提示
        PromptTool_1.default.info('开始解析WXS');
        // 开始解析wxs
        WxsTool.analyze(result);
        // 停止进度条
        ProgressTool_1.default.stop();
    }
    /**
     * 复制文件到输出目录
     * @param output               [输出目录]
     * @param result               [编译结果]
     * @param babelGeneratorConfig [babel压缩配置]
     */
    static async copy(output, { wxsFiles }, babelGeneratorConfig) {
        // 获取入口
        const entry = [...wxsFiles];
        // 遍历复制
        for (let i = 0, len = entry.length; i < len; i += 1) {
            const filePath = entry[i];
            // 读取文件内容
            const content = await FileTool_1.default.readFileAsync(filePath);
            // 移除注释
            const code = tree_tool_1.default.removeComment(content, 'wxs', {
                generator: babelGeneratorConfig,
            });
            // 获取目标路径
            const target = FileTool_1.default.getCopyTargetPath(output, filePath);
            // 开始复制
            await fs.outputFile(target, code);
        }
        // 提示
        PromptTool_1.default.log('WXS文件复制完成！');
    }
    // ------------------------------私有函数------------------------------
    /**
     * 分析文件
     * @param result [编译结果对象]
     */
    static analyze({ wxsFiles, invalidFiles }) {
        // 所有待分析的入口
        const entry = new Set(wxsFiles);
        // 初始化进度条
        ProgressTool_1.default.init({
            prefix: 'WXS',
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
                wxsFiles.add(filePath);
            });
            // 更新进度
            ProgressTool_1.default.update();
        });
    }
}
exports.default = WxsTool;
