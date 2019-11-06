// 库
import * as fs from 'fs-extra';
// 自己的库
import {
    JsTool,
    WxsTool,
    JsonTool,
    WxmlTool,
    WxssTool,
    ImageTool,
} from './mini-program';
import PromptTool from './PromptTool';
import ConfigTool from './ConfigTool';
// 定义
import {
    Result,
} from '../interface';

/**
 * 编译工具类
 */
export default class CompileTool {
    /**
     * 执行编译逻辑并复制文件
     * @param result [编译结果]
     */
    public static async build(result: Result): Promise<void> {
        // 获取最新配置
        const {
            output, // 输出目录
            terserConfig, // js压缩配置
        } = ConfigTool.init();

        // 提示
        PromptTool.info('开始复制文件');

        // 执行任务
        try {
            // 执行清理任务
            await CompileTool.clean(output);
            // 复制JS文件
            await JsTool.copy(output, result, terserConfig);
            // 复制JSON文件
            await JsonTool.copy(output, result);
            // 复制WXML文件
            await WxmlTool.copy(output, result);
            // 复制WXS文件
            await WxsTool.copy(output, result);
            // 复制WXSS文件
            await WxssTool.copy(output, result);
            // 复制Image文件
            await ImageTool.copy(output, result);
        } catch (error) {
            PromptTool.error(error.toString());
            // 异常直接退出
            process.exit(1);
        }
    }

    // ------------------------------私有函数------------------------------
    /**
     * 清理目录
     * @param output [输出目录]
     */
    private static async clean(output: string): Promise<void> {
        // 删除输出目录
        await fs.remove(output);
        // 提示
        PromptTool.log('清理文件完成！');
    }
}
