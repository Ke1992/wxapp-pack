// 库
import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs-extra';
// 自己的库
import PromptTool from './PromptTool';
// 常量
import {
    ROOT,
} from '../config';
// 定义
import {
    Result,
} from '../interface';

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
            subpackages,
            subPackages,
        } = fs.readJsonSync(appJson);
        // 小程序兼容大小写
        const packages = subpackages || subPackages;

        // 遍历主包
        pages.forEach((page: string) => {
            result.add(path.resolve(ROOT, `${page}.js`));
        });

        // 遍历子包
        _.isArray(packages) && packages.forEach((item) => {
            // 遍历所有页面
            item.pages.forEach((page: string) => {
                result.add(path.resolve(ROOT, item.root, `./${page}.js`));
            });
        });

        return result;
    }

    /**
     * 输出无效文件
     * @param result    [编辑结果]
     * @param whitelist [无效文件白名单]
     */
    public static output({ invalidFiles }: Result, whitelist: string[]): void {
        const {
            files,
        } = invalidFiles;

        // 如果没有无效文件，则直接返回
        if (!Object.keys(files).length) {
            return;
        }

        // 遍历生成正则表达式
        const regArr: RegExp[] = [];
        whitelist.forEach((item) => {
            regArr.push(new RegExp(item));
        });

        // 遍历判断是否是白名单
        _.forEach(files, (value, key) => {
            const list = new Set<string>();

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
            } else {
                delete files[key];
            }
        });

        // 输出无效文件
        PromptTool.error(('无效文件列表：'));
        PromptTool.error((JSON.stringify(files)
            .slice(1, -1)
            .replace(/"/g, '')
            .replace(/:/g, ': ')
            .replace(/],/g, ']\n')
            .replace(/\[/g, '[\n    ')
            .replace(/]/g, '\n]')
            .replace(/,/g, '\n    ')));
    }
}
