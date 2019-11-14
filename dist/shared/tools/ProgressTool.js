"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 库
const progress = require("cli-progress"); // 进度条格式
// 变量
let bar;
// 常量
const BAR_THEME = progress.Presets.shades_classic; // 进度条样式主题
const BAR_FORMAT = '：{bar} {percentage}% | 耗时: {duration}s | 详情: {value}/{total}';
/**
 * 进度工具类
 */
class ProgressTool {
    /**
     * 初始化进度条
     * @param options.total  [起始的总数量]
     * @param options.prefix [提示前缀]
     */
    static init(options) {
        // 获取参数
        const { prefix, total, } = options;
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
    static stop() {
        bar.stop();
    }
    /**
     * 更新进度条进度
     * @param num [更新的步长]
     */
    static update(num = 1) {
        bar.increment(num);
    }
    /**
     * 更新进度条总进度
     * @param num [需要增加的上限值]
     */
    static updateTotal(num) {
        bar.setTotal(bar.getTotal() + num);
    }
}
exports.default = ProgressTool;
