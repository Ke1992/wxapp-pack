// 库
import {
    exec,
} from 'child_process';
import * as _ from 'lodash';
// 自己的库
import PromptTool from './PromptTool';

/**
 * 命令执行工具类
 */
export default class CommandTool {
    /**
     * 执行命令
     * @param command [将要执行的命令]
     */
    public static async execute(command: string): Promise<void> {
        return new Promise((resolve) => {
            // 如果是空命令，则直接返回
            if (_.isEmpty(command)) {
                resolve();
            }

            // 准备执行命令
            PromptTool.info('开始执行编译命令');

            // 执行命令
            exec(command, (error) => {
                if (error) {
                    PromptTool.error(error.toString());
                    // 异常直接退出
                    process.exit(1);
                    return resolve();
                }

                PromptTool.log('编译命令执行完成！');
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
    public static openFile(filePath: string): void {
        switch (process.platform) {
            case 'darwin':
                // mac系统使用open命令打开
                exec(`open ${filePath}`);
                break;
            case 'win32':
                // win系统使用start命令打开
                exec(`start ${filePath}`);
                break;
            default:
                // 默认mac系统
                exec(`open ${filePath}`);
                break;
        }
    }
}
