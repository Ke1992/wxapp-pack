// 库
import * as path from 'path';
import * as fs from 'fs-extra';
import * as terser from 'terser';
// 自己的库
import JsonTool from './JsonTool';
import FileTool from '../FileTool';
import TreeTool from '../tree-tool';
import PromptTool from '../PromptTool';
import ProgressTool from '../ProgressTool';
// 定义
import {
    Result,
    TerserConfig,
} from '../../interface';

/**
 * JS文件工具类
 */
export default class JsTool {
    /**
     * 获取文件
     * @param entry  [分析入口路径]
     * @param result [编译结果对象]
     */
    public static getFiles(entry: Set<string>, result: Result): void {
        // 提示
        PromptTool.info('开始解析JS和JSON');
        // 初始化进度条
        ProgressTool.init({
            prefix: 'JS和JSON',
            total: entry.size,
        });
        // 开始第一次解析JS
        const source = JsTool.analyze(entry, result, true);
        // 开始递归解析JSON和JS
        JsonTool.getFiles(source, result);
        // 停止进度条
        ProgressTool.stop();
    }

    /**
     * 复制文件到输出目录
     * @param output       [输出目录]
     * @param result       [编译结果]
     * @param terserConfig [JS压缩配置]
     */
    public static async copy(
        output: string, { jsFiles }: Result, terserConfig: TerserConfig,
    ): Promise<void> {
        // 获取入口
        const entry = [...jsFiles];

        // 遍历复制
        for (let i = 0, len = entry.length; i < len; i += 1) {
            const filePath = entry[i];
            // 读取文件内容
            const content = await FileTool.readFileAsync(filePath);
            // 压缩代码
            const {
                code,
                error,
            } = terser.minify(content, terserConfig);
            // 如果出现异常，直接抛出
            if (error) {
                throw error;
            }
            // 获取目标路径
            const target = FileTool.getCopyTargetPath(output, filePath);
            // 开始复制（压缩代码）
            await fs.outputFile(target, code);
        }

        // 提示
        PromptTool.log('JS文件复制完成！');
    }

    /**
     * 分析文件
     * @param entry  [分析入口]
     * @param result [编译结果对象]
     */
    public static analyze(
        entry: Set<string>, { jsFiles, wxsFiles, invalidFiles }: Result, isInit = false,
    ): Set<string> {
        const result = new Set<string>();

        // 更新总量
        !isInit && ProgressTool.updateTotal(entry.size);
        // 遍历获取
        entry.forEach((item) => {
            // 获取依赖分析树
            TreeTool.toList(item).forEach((filePath) => {
                // 校验文件是否存在
                if (!FileTool.checkExists(item, filePath, invalidFiles)) {
                    return;
                }

                // 获取文件后缀
                const ext = path.extname(filePath);

                // 根据类型添加到对应的结果
                if (ext === '.wxs') {
                    wxsFiles.add(filePath);
                } else {
                    result.add(filePath);
                    jsFiles.add(filePath);
                }
            });

            // 更新进度
            ProgressTool.update();
        });

        return result;
    }
}
