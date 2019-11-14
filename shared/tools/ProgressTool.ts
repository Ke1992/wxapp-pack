// 库
import * as progress from 'cli-progress'; // 进度条格式
// 定义
import {
    ProgressOption,
} from '../interface';
// 变量
let bar: progress.Bar;
// 常量
const BAR_THEME = progress.Presets.shades_classic; // 进度条样式主题
const BAR_FORMAT = '：{bar} {percentage}% | 耗时: {duration}s | 详情: {value}/{total}';

/**
 * 进度工具类
 */
export default class ProgressTool {
    /**
     * 初始化进度条
     * @param options.total  [起始的总数量]
     * @param options.prefix [提示前缀]
     */
    public static init(options: ProgressOption): void {
        // 获取参数
        const {
            prefix,
            total,
        } = options;

        // 初始化
        bar = new progress.Bar({
            format: prefix + BAR_FORMAT,
        }, BAR_THEME);
        // 启动进度条
        bar.start(total, 0);
    }

    /**
     * 停止进度条
     */
    public static stop(): void {
        bar.stop();
    }

    /**
     * 更新进度条进度
     * @param num [更新的步长]
     */
    public static update(num = 1): void {
        bar.increment(num);
    }

    /**
     * 更新进度条总进度
     * @param num [需要增加的上限值]
     */
    public static updateTotal(num: number): void {
        bar.setTotal(bar.getTotal() + num);
    }
}
