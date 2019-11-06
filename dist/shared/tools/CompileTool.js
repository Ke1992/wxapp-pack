"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 库
const fs = require("fs-extra");
// 自己的库
const mini_program_1 = require("./mini-program");
const PromptTool_1 = require("./PromptTool");
const ConfigTool_1 = require("./ConfigTool");
/**
 * 编译工具类
 */
class CompileTool {
    /**
     * 执行编译逻辑并复制文件
     * @param result [编译结果]
     */
    static async build(result) {
        // 获取最新配置
        const { output, // 输出目录
        terserConfig, } = ConfigTool_1.default.init();
        // 提示
        PromptTool_1.default.info('开始复制文件');
        // 执行任务
        try {
            // 执行清理任务
            await CompileTool.clean(output);
            // 复制JS文件
            await mini_program_1.JsTool.copy(output, result, terserConfig);
            // 复制JSON文件
            await mini_program_1.JsonTool.copy(output, result);
            // 复制WXML文件
            await mini_program_1.WxmlTool.copy(output, result);
            // 复制WXS文件
            await mini_program_1.WxsTool.copy(output, result);
            // 复制WXSS文件
            await mini_program_1.WxssTool.copy(output, result);
            // 复制Image文件
            await mini_program_1.ImageTool.copy(output, result);
        }
        catch (error) {
            PromptTool_1.default.error(error.toString());
            // 异常直接退出
            process.exit(1);
        }
    }
    // ------------------------------私有函数------------------------------
    /**
     * 清理目录
     * @param output [输出目录]
     */
    static async clean(output) {
        // 删除输出目录
        await fs.remove(output);
        // 提示
        PromptTool_1.default.log('清理文件完成！');
    }
}
exports.default = CompileTool;
