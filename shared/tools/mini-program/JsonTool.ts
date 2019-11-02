// 库
import * as _ from 'lodash';
import * as fs from 'fs-extra';
// 自己的库
import JsTool from './JsTool';
import FileTool from '../FileTool';
import ProgressTool from '../ProgressTool';
// 定义
import {
    Result,
} from '../../interface';

/**
 * JSON文件工具类
 */
export default class JsonTool {
    /**
     * 获取文件
     * @param entry  [分析入口路径]
     * @param result [编译结果对象]
     */
    public static getFiles(entry: Set<string>, result: Result): void {
        // 递归结束
        if (entry.size === 0) {
            return;
        }
        // 获取引用的组件
        const components = JsonTool.analyze(entry, result);
        // 解析引用的组件
        const source = JsTool.analyze(components, result);
        // 进行递归
        JsonTool.getFiles(source, result);
    }

    // ------------------------------私有函数------------------------------
    /**
     * 分析文件
     * @param entry  [分析入口]
     * @param result [编译结果对象]
     */
    private static analyze(entry: Set<string>, { jsFiles, jsonFiles }: Result): Set<string> {
        // 引用的所有组件
        const components = new Set<string>();
        // 更新总量
        ProgressTool.updateTotal(entry.size);
        // 遍历判断是否存在
        entry.forEach((item) => {
            const filePath = item.replace('.js', '.json');

            // 检查json文件是否存在
            if (fs.existsSync(filePath)) {
                jsonFiles.add(filePath);
                // 读取配置
                const {
                    usingComponents,
                } = fs.readJsonSync(filePath);

                // 使用了插件
                if (!_.isEmpty(usingComponents)) {
                    // 遍历插件
                    _.forEach(usingComponents, (value) => {
                        // 插件，直接忽略
                        if (value.indexOf('plugin://') === 0) {
                            return;
                        }
                        // 组件js的绝对路径
                        const jsPath = FileTool.getAbsolutePath(item, `${value}.js`);
                        // 不是新的文件就需要再次解析
                        !jsFiles.has(jsPath) && components.add(jsPath);
                    });
                }
            }

            // 更新进度
            ProgressTool.update();
        });
        // 返回结果
        return components;
    }
}
