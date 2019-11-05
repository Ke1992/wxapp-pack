"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 库
const path = require("path");
const fs = require("fs-extra");
// 自己的库
const PromptTool_1 = require("../PromptTool");
const ProgressTool_1 = require("../ProgressTool");
// 常量
const config_1 = require("../../config");
/**
 * 图片资源工具类
 */
class ImageTool {
    /**
     * 获取文件
     * @param result [编译结果对象]
     */
    static getFiles(result) {
        // 提示
        PromptTool_1.default.info('开始解析Image');
        // 初始化进度条
        ProgressTool_1.default.init({
            prefix: 'Image',
            total: 1,
        });
        // 开始解析wxs
        ImageTool.analyze(result, config_1.ROOT_PATH, true);
        // 停止进度条
        ProgressTool_1.default.stop();
    }
    // ------------------------------私有函数------------------------------
    /**
     * 分析文件
     * @param result [编译结果对象]
     * @param entry  [待分析的入口路径]
     * @param isInit [是否是第一次解析]
     */
    static analyze(result, entry, isInit = false) {
        const { imageFiles, } = result;
        // 更新总量
        !isInit && ProgressTool_1.default.updateTotal(1);
        // 获取目录下的所有文件
        fs.readdirSync(entry).forEach((item) => {
            // 获取后缀
            const ext = path.extname(item);
            const filePath = path.resolve(entry, './', item); // 绝对路径
            // TODO: 这里应该开配置项
            if (ext === '.jpg' || ext === '.png' || ext === '.gif') {
                imageFiles.add(filePath);
            }
            else if (filePath.indexOf('node_modules') < 0 && fs.statSync(filePath).isDirectory()) {
                // 非node_modules && 对目录进行递归
                ImageTool.analyze(result, filePath);
            }
        });
        // 更新进度
        ProgressTool_1.default.update();
    }
}
exports.default = ImageTool;
