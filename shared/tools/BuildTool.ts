// 库
import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs-extra';
// 常量
import {
    ROOT,
} from '../config';

/**
 * 编译命令工具类
 */
export default class BuildTool {
    /**
     * 获取所有入口路径
     * @param appJs   [app.js]
     * @param appJson [app.json]
     */
    public static getAllEntry(appJs: string, appJson: string): Set<string> {
        const result = new Set<string>([appJs]);
        // 获取主包和子包
        const {
            pages,
            subPackages,
        } = fs.readJsonSync(appJson);

        // 遍历主包
        pages.forEach((page: string) => {
            result.add(path.resolve(ROOT, `${page}.js`));
        });

        // 遍历子包
        _.isArray(subPackages) && subPackages.forEach((item) => {
            // 遍历所有页面
            item.pages.forEach((page: string) => {
                result.add(path.resolve(ROOT, item.root, `./${page}.js`));
            });
        });

        return result;
    }
}
