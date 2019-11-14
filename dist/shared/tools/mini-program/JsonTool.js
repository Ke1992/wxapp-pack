"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 库
const _ = require("lodash");
const fs = require("fs-extra");
// 自己的库
const JsTool_1 = require("./JsTool");
const FileTool_1 = require("../FileTool");
const PromptTool_1 = require("../PromptTool");
const ProgressTool_1 = require("../ProgressTool");
/**
 * JSON文件工具类
 */
class JsonTool {
    /**
     * 获取文件
     * @param entry  [分析入口路径]
     * @param result [编译结果对象]
     */
    static getFiles(entry, result) {
        // 递归结束
        if (entry.size === 0) {
            return;
        }
        // 获取引用的组件
        const components = JsonTool.analyze(entry, result);
        // 解析引用的组件
        const source = JsTool_1.default.analyze(components, result);
        // 进行递归
        JsonTool.getFiles(source, result);
    }
    /**
     * 复制文件到输出目录
     * @param output [输出目录]
     * @param result [编译结果]
     */
    static async copy(output, { jsonFiles }) {
        // 获取入口
        const entry = [...jsonFiles];
        // 提示
        PromptTool_1.default.info('开始复制JSON文件');
        // 初始化进度条
        ProgressTool_1.default.init({
            prefix: 'JSON复制进度',
            total: entry.length,
        });
        // 遍历复制
        for (let i = 0, len = entry.length; i < len; i += 1) {
            const filePath = entry[i];
            // 获取目标路径
            const target = FileTool_1.default.getCopyTargetPath(output, filePath);
            // 开始复制
            await fs.copy(filePath, target, {
                overwrite: true,
            });
            // 更新进度
            ProgressTool_1.default.update();
        }
        // 停止进度条
        ProgressTool_1.default.stop();
    }
    // ------------------------------私有函数------------------------------
    /**
     * 分析文件
     * @param entry  [分析入口]
     * @param result [编译结果对象]
     */
    static analyze(entry, { jsFiles, jsonFiles, invalidFiles }) {
        // 引用的所有组件
        const components = new Set();
        // 更新总量
        ProgressTool_1.default.updateTotal(entry.size);
        // 遍历获取
        entry.forEach((item) => {
            const filePath = FileTool_1.default.replaceExt(item, '.json');
            // 检查json文件是否存在
            if (fs.existsSync(filePath)) {
                jsonFiles.add(filePath);
                // 读取配置
                const { usingComponents, } = fs.readJsonSync(filePath);
                // 使用了组件
                if (!_.isEmpty(usingComponents)) {
                    // 遍历组件
                    _.forEach(usingComponents, (value) => {
                        // 插件，直接忽略
                        if (value.indexOf('plugin://') === 0) {
                            return;
                        }
                        // 组件的绝对路径
                        const jsPath = FileTool_1.default.getAbsolutePath(item, `${value}.js`);
                        // 新文件
                        if (!jsFiles.has(jsPath)) {
                            // 校验文件是否存在
                            if (!FileTool_1.default.checkExists(filePath, jsPath, invalidFiles)) {
                                return;
                            }
                            // 需要再次解析
                            components.add(jsPath);
                        }
                    });
                }
            }
            // 更新进度
            ProgressTool_1.default.update();
        });
        // 返回结果
        return components;
    }
}
exports.default = JsonTool;
