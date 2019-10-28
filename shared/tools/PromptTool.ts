// 库
import chalk from 'chalk';

/**
 * 信息输出工具类
 */
export default class PromptTool {
    /**
     * 输出提示信息（使用chalk.green）
     * @param content [将要输出的提示信息]
     */
    public static info(content: string): void {
        console.error(chalk.green(content));
    }

    /**
     * 输出日志信息（使用原始颜色）
     * @param content [将要输出的提示信息]
     */
    public static log(content: string): void {
        console.log(content);
    }

    /**
     * 输出异常信息（使用chalk.red）
     * @param content [将要输出的提示信息]
     */
    public static error(content: string): void {
        console.error(chalk.red(content));
    }
}
