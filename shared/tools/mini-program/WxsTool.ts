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
