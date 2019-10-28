"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 库
const chalk_1 = require("chalk");
/**
 * 信息输出工具类
 */
class PromptTool {
    /**
     * 输出提示信息（使用chalk.green）
     * @param content [将要输出的提示信息]
     */
    static info(content) {
        console.error(chalk_1.default.green(content));
    }
    /**
     * 输出日志信息（使用原始颜色）
     * @param content [将要输出的提示信息]
     */
    static log(content) {
        console.log(content);
    }
    /**
     * 输出异常信息（使用chalk.red）
     * @param content [将要输出的提示信息]
     */
    static error(content) {
        console.error(chalk_1.default.red(content));
    }
}
exports.default = PromptTool;
