"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 库
const _ = require("lodash");
const fs = require("fs-extra");
// 自己的库
const JsTool_1 = require("./JsTool");
const FileTool_1 = require("../FileTool");
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
    // ------------------------------私有函数------------------------------
    /**
     * 分析文件
     * @param entry  [分析入口]
     * @param result [编译结果对象]
     */
    static analyze(entry, { jsFiles, jsonFiles }) {
        // 引用的所有组件
        const components = new Set();
        // 更新总量
        ProgressTool_1.default.updateTotal(entry.size);
        // 遍历判断是否存在
        entry.forEach((item) => {
            const filePath = item.replace('.js', '.json');
            // 检查json文件是否存在
            if (fs.existsSync(filePath)) {
                jsonFiles.add(filePath);
                // 读取配置
                const { usingComponents, } = fs.readJsonSync(filePath);
                // 使用了插件
                if (!_.isEmpty(usingComponents)) {
                    // 遍历插件
                    _.forEach(usingComponents, (value) => {
                        // 插件，直接忽略
                        if (value.indexOf('plugin://') === 0) {
                            return;
                        }
                        // 组件js的绝对路径
                        const jsPath = FileTool_1.default.getAbsolutePath(item, `${value}.js`);
                        // 不是新的文件就需要再次解析
                        !jsFiles.has(jsPath) && components.add(jsPath);
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
