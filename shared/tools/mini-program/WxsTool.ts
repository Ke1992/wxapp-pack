// 库
import * as fs from 'fs-extra';
// 自己的库
import FileTool from '../FileTool';
import TreeTool from '../tree-tool';
import PromptTool from '../PromptTool';
import ProgressTool from '../ProgressTool';
// 定义
import {
    Result,
} from '../../interface';

/**
 * WXS文件工具类
 */
export default class WxsTool {
    /**
     * 获取文件
     * @param result [编译结果对象]
     */
    public static getFiles(result: Result): void {
        // 提示
        PromptTool.info('开始解析WXS');
        // 开始解析wxs
        WxsTool.analyze(result);
        // 停止进度条
        ProgressTool.stop();
    }

    /**
     * 复制文件到输出目录
     * @param output [输出目录]
     * @param result [编译结果]
     */
    public static async copy(output: string, { wxsFiles }: Result): Promise<void> {
        // 获取入口
        const entry = [...wxsFiles];

        // 遍历复制
        for (let i = 0, len = entry.length; i < len; i += 1) {
            const filePath = entry[i];
            // 获取目标路径
            const target = FileTool.getCopyTargetPath(output, filePath);
            // 开始复制
            // TODO: 考虑是否需要移除一下注释
            await fs.copy(filePath, target, {
                overwrite: true, // 开启覆盖模式
            });
        }

        // 提示
        PromptTool.log('WXS文件复制完成！');
    }

    // ------------------------------私有函数------------------------------
    /**
     * 分析文件
     * @param result [编译结果对象]
     */
    private static analyze({ wxsFiles, invalidFiles }: Result): void {
        // 所有待分析的入口
        const entry = new Set<string>(wxsFiles);

        // 初始化进度条
        ProgressTool.init({
            prefix: 'WXS',
            total: entry.size,
        });

        // 遍历获取
        entry.forEach((item) => {
            // 获取依赖分析树
            TreeTool.toList(item).forEach((filePath) => {
                // 校验文件是否存在
                if (!FileTool.checkExists(item, filePath, invalidFiles)) {
                    return;
                }
                wxsFiles.add(filePath);
            });
            // 更新进度
            ProgressTool.update();
        });
    }
}
