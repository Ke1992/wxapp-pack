"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 库
const _ = require("lodash");
const path = require("path");
const fs = require("fs-extra");
// 自己的库
const PromptTool_1 = require("./PromptTool");
// 常量
const config_1 = require("../config");
/**
 * 编译命令工具类
 */
class BuildTool {
    /**
     * 获取所有入口路径
     * @param appJs   [app.js]
     * @param appJson [app.json]
     */
    static getAllEntry(appJs, appJson) {
        const result = new Set([appJs]);
        // 获取主包和子包
        const { pages, subPackages, } = fs.readJsonSync(appJson);
        // 遍历主包
        pages.forEach((page) => {
            result.add(path.resolve(config_1.ROOT, `${page}.js`));
        });
        // 遍历子包
        _.isArray(subPackages) && subPackages.forEach((item) => {
            // 遍历所有页面
            item.pages.forEach((page) => {
                result.add(path.resolve(config_1.ROOT, item.root, `./${page}.js`));
            });
        });
        return result;
    }
    /**
     * 输出无效文件
     * @param result    [编辑结果]
     * @param whitelist [无效文件白名单]
     */
    static output({ invalidFiles }, whitelist) {
        const { files, } = invalidFiles;
        // 如果没有无效文件，则直接返回
        if (!Object.keys(files).length) {
            return;
        }
        // 遍历生成正则表达式
        const regArr = [];
        whitelist.forEach((item) => {
            regArr.push(new RegExp(item));
        });
        // 遍历判断是否是白名单
        _.forEach(files, (value, key) => {
            const list = new Set();
            // 遍历检查文件
            value.forEach((filePath) => {
                // 检查是否是白名单
                const isWhite = regArr.some((reg) => {
                    if (reg.test(filePath)) {
                        return true;
                    }
                    return false;
                });
                // 不是白名单
                !isWhite && list.add(filePath);
            });
            // 不存在非白名单的文件，则直接删除
            if (list.size) {
                files[key] = [...list];
            }
            else {
                delete files[key];
            }
        });
        // 输出无效文件
        PromptTool_1.default.error(('无效文件列表：'));
        PromptTool_1.default.error((JSON.stringify(files)
            .slice(1, -1)
            .replace(/"/g, '')
            .replace(/:/g, ': ')
            .replace(/],/g, ']\n')
            .replace(/\[/g, '[\n    ')
            .replace(/]/g, '\n]')
            .replace(/,/g, '\n    ')));
    }
}
exports.default = BuildTool;
