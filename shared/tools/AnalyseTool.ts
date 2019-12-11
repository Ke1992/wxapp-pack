// 库
import * as path from 'path';
import * as fs from 'fs-extra';
// 自己的库
import {
    JsTool,
    WxsTool,
    JsonTool,
    WxmlTool,
    WxssTool,
} from './mini-program';
import FileTool from './FileTool';
import TreeTool from './tree-tool';
import BuildTool from './BuildTool';
// 常量
import {
    SEP,
    ROOT,
    RESULT_FILE_KEY,
    ANALYSE_HTML_PATH,
    ANALYSE_WHITE_LIST,
} from '../config';
// 定义
import {
    Result,
    AnalyseResult,
} from '../interface';

/**
 * 分析命令工具类
 */
export default class AnalyseTool {
    /**
     * 获取所有未使用的文件
     * @param currentFiles [当前目录所有文件]
     * @param outputFiles  [编译目录所有文件]
     * @param whiteList    [白名单]
     */
    public static getUnusedFiles(
        currentFiles: AnalyseResult, outputFiles: AnalyseResult, whiteList: string[],
    ): AnalyseResult {
        const result: AnalyseResult = {
            js: [],
            wxs: [],
            json: [],
            wxml: [],
            wxss: [],
            image: [],
        };
        const regArr: RegExp[] = [];

        // 遍历生成正则表达式
        whiteList.concat(ANALYSE_WHITE_LIST).forEach((item) => {
            regArr.push(new RegExp(item));
        });

        // 遍历获取结果
        RESULT_FILE_KEY.forEach((key) => {
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
     * 绘制模块依赖分析图
     */
    public static generateModuleGraph(): string {
        // 编译结果
        const result: Result = {
            jsFiles: new Set<string>(),
            wxsFiles: new Set<string>(),
            jsonFiles: new Set<string>(),
            wxmlFiles: new Set<string>(),
            wxssFiles: new Set<string>(),
            imageFiles: new Set<string>(),
            invalidFiles: {
                files: {},
                list: new Set<string>(), // 确保唯一值
            },
        };

        // 初始入口文件
        const appJs = path.resolve(ROOT, 'app.js');
        const appJson = path.resolve(ROOT, 'app.json');

        // 校验app.js、app.json是否存在
        if (!fs.existsSync(appJs) || !fs.existsSync(appJson)) {
            // 不存在直接返回空
            return JSON.stringify({
                js: {},
                wxs: {},
                json: {},
                wxml: {},
                wxss: {},
            });
        }

        // 获取所有入口路径
        const entry = BuildTool.getAllEntry(appJs, appJson, result);
        // 获取js和json
        JsTool.getFiles(entry, result);
        // 获取wxml
        WxmlTool.getFiles(result);
        // 获取wxs
        WxsTool.getFiles(result);
        // 获取wxss
        WxssTool.getFiles(result, appJs);

        // 获取模块依赖关系
        const graph = TreeTool.getGraph();
        // 将appJson的模块更新到结果中，这里对entry有删除操作，后续使用需注意
        JsonTool.updateGraph(appJs, appJson, entry, graph);
        // 移除所有的路径前缀
        const reg = new RegExp(path.join(path.resolve(ROOT), SEP), 'g');

        // 返回结果
        return JSON.stringify(graph).replace(reg, '');
    }

    /**
     * 生成最终分析HTML文件
     * @param files   [分析结果]
     * @param analyse [分析文件输出目录]
     * @param graph   [模块依赖关系]
     */
    public static async createAnalyseHtml(
        files: AnalyseResult, analyse: string, graph: string,
    ): Promise<string> {
        // 获取模板文件内容
        let content = await FileTool.readFileAsync(ANALYSE_HTML_PATH);
        // 获取目标路径
        const filePath = path.resolve(analyse, './analyse.html');

        // 遍历添加结果
        RESULT_FILE_KEY.forEach((key) => {
            let result = '';

            // 遍历获取结果
            files[key].forEach((ceil) => {
                result += `<div>${ceil}</div>`;
            });

            content = content.replace(`{_${key}_len_}`, files[key].length.toString())
                .replace(`{_${key}_}`, result || '<div>不存在未使用的文件！</div>');
        });

        // 替换模块依赖关系
        content = content.replace('{_graph_}', graph);

        // 将内容写入指定目录文件
        await fs.outputFile(filePath, content);

        // 返回目标文件路径
        return filePath;
    }
}
