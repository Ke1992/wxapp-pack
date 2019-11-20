"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 库
const path = require("path");
const fs = require("fs-extra");
// 自己的库
const FileTool_1 = require("./FileTool");
// 常量
const config_1 = require("../config");
/**
 * 分析命令工具类
 */
class AnalyseTool {
    /**
     * 获取所有未使用的文件
     * @param currentFiles [当前目录所有文件]
     * @param outputFiles  [编译目录所有文件]
     * @param whiteList    [白名单]
     */
    static getUnusedFiles(currentFiles, outputFiles, whiteList) {
        const result = {
            js: [],
            wxs: [],
            json: [],
            wxml: [],
            wxss: [],
            image: [],
        };
        const regArr = [];
        // 遍历生成正则表达式
        whiteList.concat(config_1.ANALYSE_WHITE_LIST).forEach((item) => {
            regArr.push(new RegExp(item));
        });
        // 遍历获取结果
        config_1.RESULT_FILE_KEY.forEach((key) => {
            const source = outputFiles[key];
            // 遍历检查文件是否存在
            currentFiles[key].forEach((filePath) => {
                // 检查是否是白名单
                const isWhite = regArr.some((reg) => {
                    if (reg.test(filePath)) {
                        return true;
                    }
                    return false;
                });
                // 不存在，才塞入结果中
                source.indexOf(filePath) < 0 && !isWhite && result[key].push(filePath);
            });
        });
        return result;
    }
    /**
     * 生成最终分析HTML文件
     * @param files   [分析结果]
     * @param analyse [分析文件输出目录]
     */
    static async createAnalyseHtml(files, analyse) {
        // 获取模板文件内容
        let content = await FileTool_1.default.readFileAsync(config_1.ANALYSE_HTML_PATH);
        // 获取目标路径
        const filePath = path.resolve(analyse, './analyse.html');
        // 遍历添加结果
        config_1.RESULT_FILE_KEY.forEach((key) => {
            let result = '';
            // 遍历获取结果
            files[key].forEach((ceil) => {
                result += `<div>${ceil}</div>`;
            });
            content = content.replace(`{_${key}_len_}`, files[key].length.toString())
                .replace(`{_${key}_}`, result || '<div>不存在未使用的文件！</div>');
        });
        // 将内容写入指定目录文件
        await fs.outputFile(filePath, content);
        // 返回目标文件路径
        return filePath;
    }
}
exports.default = AnalyseTool;
