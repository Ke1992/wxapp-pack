"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 库
const _ = require("lodash");
const path = require("path");
const fs = require("fs-extra");
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
}
exports.default = BuildTool;
