// 库
import * as path from 'path';
import * as fs from 'fs-extra';
// 常量
import {
    SEP,
    ROOT,
    ROOT_PATH,
    RESULT_FILE_KEY,
} from '../config';
// 定义
import {
    InvalidFiles,
    AnalyseResult,
} from '../interface';

/**
 * 文件操作工具类
 */
export default class FileTool {
    /**
     * 封装fs.readFile成Promise
     * @param filePath [文件路径]
     */
    public static readFileAsync(filePath: string): Promise<string> {
        return new Promise((resolve) => {
            fs.readFile(filePath, 'utf8', (error, data) => {
                // 异常直接抛出
                if (error) {
                    throw error;
                }
                // 正常返回
                resolve(data.toString());
            });
        });
    }

    /**
     * 根据入口获取绝对路径
     * @param entry  [入口路径]
     * @param source [待格式化的路径]
     */
    public static getAbsolutePath(entry: string, source: string): string {
        // 是绝对路径
        if (source[0] === '/') {
            return path.join(ROOT_PATH, source);
        }
        // 其他都当做相对路径
        return path.join(entry, '../', source);
    }

    /**
     * 校验文件是否存在
     * @param entry        [入口路径]
     * @param filePath     [依赖文件路径]
     * @param invalidFiles [无效文件]
     */
    public static checkExists(
        entry: string, filePath: string, invalidFiles: InvalidFiles,
    ): boolean {
        const {
            list,
            files,
        } = invalidFiles;
        // 路径前缀
        const prefix = path.resolve(ROOT) + SEP;

        // 文件存在
        if (fs.existsSync(filePath)) {
            return true;
        }
        // 没有重复则加入结果
        if (!list.has(filePath)) {
            // 移除前缀
            const key = entry.replace(prefix, '');
            const value = filePath.replace(prefix, '');

            // 初始化
            if (!files[key]) {
                files[key] = [];
            }

            // 加入结果
            list.add(filePath);
            files[key].push(value);
        }
        return false;
    }

    /**
     * 替换文件后缀名
     * @param filePath [待替换的原始文件路径]
     * @param ext      [新的文件后缀名]
     */
    public static replaceExt(filePath: string, ext: string): string {
        // 将路径解析成对象
        const item = path.parse(filePath);

        // 清空base属性
        item.base = '';
        // 重置ext
        item.ext = ext;

        // 返回替换后的结果
        return path.format(item);
    }

    /**
     * 获取复制后的目标路径
     * @param output   [输出目录]
     * @param filePath [待复制的文件路径]
     */
    public static getCopyTargetPath(output: string, filePath: string): string {
        return path.join(output, filePath.replace(ROOT_PATH, ''));
    }

    /**
     * 获取json引用的组件路径
     * @param entry     [分析入口]
     * @param component [引用的组件]
     */
    public static getComponentPath(entry: string, component: string): string {
        const result = FileTool.getAbsolutePath(entry, `${component}.js`);
        // 组件的上级目录
        const dirPath = result.slice(0, -3);

        // 文件不存在 && 上级目录存在 && 是模糊匹配（即指定了文件夹）
        if (
            !fs.existsSync(result) && fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()
        ) {
            // 返回补全后路径
            return FileTool.getAbsolutePath(entry, `${component}/index.js`);
        }

        // 返回结果
        return result;
    }

    /**
     * 获取对应目录下所有文件
     * @param entry        [入口路径]]
     * @param root         [根目录]
     * @param imageExtList [图片后缀白名单]
     */
    public static getAllFile(entry: string, root: string, imageExtList: string[]): AnalyseResult {
        const result: AnalyseResult = {
            js: [],
            wxs: [],
            json: [],
            wxml: [],
            wxss: [],
            image: [],
        };

        // 获取目录下的所有文件
        fs.readdirSync(entry).forEach((item) => {
            // 获取后缀
            const ext = path.extname(item);
            const filePath = path.resolve(entry, './', item); // 绝对路径

            if (ext === '.js') {
                result.js.push(filePath.replace(root, ''));
            } else if (ext === '.wxs') {
                result.wxs.push(filePath.replace(root, ''));
            } else if (ext === '.json') {
                result.json.push(filePath.replace(root, ''));
            } else if (ext === '.wxml') {
                result.wxml.push(filePath.replace(root, ''));
            } else if (ext === '.wxss') {
                result.wxss.push(filePath.replace(root, ''));
            } else if (imageExtList.includes(ext)) {
                result.image.push(filePath.replace(root, ''));
            } else if (filePath.indexOf('node_modules') < 0 && fs.statSync(filePath).isDirectory()) {
                // 非node_modules && 对目录进行递归
                const source = FileTool.getAllFile(filePath, root, imageExtList);

                // 遍历填充
                RESULT_FILE_KEY.forEach((key) => result[key].push(...source[key]));
            }
        });

        return result;
    }
}
