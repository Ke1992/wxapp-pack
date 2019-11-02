"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 库
const child_process_1 = require("child_process");
const _ = require("lodash");
// 自己的库
const PromptTool_1 = require("./PromptTool");
/**
 * 命令执行工具类
 */
class CommandTool {
    /**
     * 执行命令
     * @param command [将要执行的命令]
     */
    static async execute(command) {
        return new Promise((resolve) => {
            // 如果是空命令，则直接返回
            if (_.isEmpty(command)) {
                resolve();
            }
            // 准备执行命令
            PromptTool_1.default.info('开始执行编译命令');
            // 执行命令
            child_process_1.exec(command, (error) => {
                if (error) {
                    PromptTool_1.default.error(error.toString());
                    // 异常直接退出
                    process.exit(1);
                    return resolve();
                }
                PromptTool_1.default.log('编译命令执行完成！');
                return resolve();
            }).stdout.on('data', (data) => {
                process.stdout.write(data);
            });
        });
    }
    /**
     * 使用浏览器打开文件
     * @param filePath [目标文件路径]
     */
    static openFile(filePath) {
        switch (process.platform) {
            case 'darwin':
                // mac系统使用open命令打开
                child_process_1.exec(`open ${filePath}`);
                break;
            case 'win32':
                // win系统使用start命令打开
                child_process_1.exec(`start ${filePath}`);
                break;
            default:
                // 默认mac系统
                child_process_1.exec(`open ${filePath}`);
                break;
        }
    }
}
exports.default = CommandTool;
