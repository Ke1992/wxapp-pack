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
 * WXSS文件工具类
 */
export default class WxssTool {
    /**
     * 获取文件
     * @param result [编译结果对象]
     */
    public static getFiles(result: Result, appJs: string): void {
        // 提示
        PromptTool.info('开始解析WXSS');
        // 开始解析wxss
        WxssTool.analyze(result, appJs);
        // 停止进度条
        ProgressTool.stop();
    }

    // ------------------------------私有函数------------------------------
    /**
     * 分析文件
     * @param result [编译结果对象]
     */
    private static analyze({ wxmlFiles, wxssFiles, invalidFiles }: Result, appJS: string): void {
        // 所有待分析的入口
        const entry = new Set<string>();

        // 特殊处理app.wxss（因为不存在app.wxml）
        const appWxss = FileTool.replaceExt(appJS, '.wxss');
        fs.existsSync(appWxss) && entry.add(appWxss);

        // 遍历获取所有wxss文件
        wxmlFiles.forEach((item) => {
            const filePath = FileTool.replaceExt(item, '.wxss');

            // 检查wxss文件是否存在
            fs.existsSync(filePath) && entry.add(filePath);
        });

        // 初始化进度条
        ProgressTool.init({
            prefix: 'WXSS',
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
                wxssFiles.add(filePath);
            });
            // 更新进度
            ProgressTool.update();
        });
    }
}
