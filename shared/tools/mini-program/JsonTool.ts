// 库
import * as _ from 'lodash';
import * as fs from 'fs-extra';
// 自己的库
import JsTool from './JsTool';
import FileTool from '../FileTool';
import PromptTool from '../PromptTool';
import ProgressTool from '../ProgressTool';
// 定义
import {
    Result,
    AnalyseGraph,
    AnalyseGraphResult,
} from '../../interface';
// 变量
const graph: AnalyseGraph = {};

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

    /**
     * 复制文件到输出目录
     * @param output [输出目录]
     * @param result [编译结果]
     */
    public static async copy(output: string, { jsonFiles }: Result): Promise<void> {
        // 获取入口
        const entry = [...jsonFiles];

        // 提示
        PromptTool.info('开始复制JSON文件');
        // 初始化进度条
        ProgressTool.init({
            prefix: 'JSON复制进度',
            total: entry.length,
        });
        // 遍历复制
        for (let i = 0, len = entry.length; i < len; i += 1) {
            const filePath = entry[i];
            // 获取目标路径
            const target = FileTool.getCopyTargetPath(output, filePath);
            // 开始复制
            await fs.copy(filePath, target, {
                overwrite: true, // 开启覆盖模式
            });
            // 更新进度
            ProgressTool.update();
        }
        // 停止进度条
        ProgressTool.stop();
    }

    /**
     * 获取模块依赖关系
     */
    public static getGraph(): AnalyseGraph {
        return graph;
    }

    /**
     * 更新模块依赖关系
     * @param appJs   [appjs的绝对路径]
     * @param appJson [appjson的绝对路径]
     * @param source  [appjson的主包、子包等]
     * @param result  [模块依赖分析结果]
     */
    public static updateGraph(
        appJs: string, appJson: string, source: Set<string>, result: AnalyseGraphResult,
    ): void {
        const {
            json,
        } = result;

        // 如果没有appJson对应的变量，则新增一个
        if (!json[appJson]) {
            json[appJson] = [];
        }
        // 删除appjs
        source.delete(appJs);
        // 遍历添加
        source.forEach((item) => {
            json[appJson].push(`${item}on`);
        });
    }

    // ------------------------------私有函数------------------------------
    /**
     * 分析文件
     * @param entry  [分析入口]
     * @param result [编译结果对象]
     */
    private static analyze(
        entry: Set<string>, { jsFiles, jsonFiles, invalidFiles }: Result,
    ): Set<string> {
        // 引用的所有组件
        const components = new Set<string>();
        // 更新总量
        ProgressTool.updateTotal(entry.size);
        // 遍历获取
        entry.forEach((item) => {
            const filePath = FileTool.replaceExt(item, '.json');

            // 检查json文件是否存在
            if (fs.existsSync(filePath)) {
                jsonFiles.add(filePath);
                const graphItem = new Set<string>();
                // 读取配置
                const {
                    usingComponents,
                } = fs.readJsonSync(filePath);

                // 使用了组件
                if (!_.isEmpty(usingComponents)) {
                    // 遍历组件
                    _.forEach(usingComponents, (value) => {
                        // 插件，直接忽略
                        if (value.indexOf('plugin://') === 0) {
                            return;
                        }

                        // 组件的绝对路径
                        const jsPath = FileTool.getComponentPath(item, value);
                        // 将组件添加到模块关系依赖中
                        graphItem.add(`${jsPath}on`);

                        // 新文件
                        if (!jsFiles.has(jsPath)) {
                            // 校验文件是否存在
                            if (!FileTool.checkExists(filePath, jsPath, invalidFiles)) {
                                return;
                            }
                            // 需要再次解析
                            components.add(jsPath);
                        }
                    });
                }
                // 添加到缓存中
                graph[filePath] = [...graphItem];
            }

            // 更新进度
            ProgressTool.update();
        });
        // 返回结果
        return components;
    }
}
