// 库
import * as path from 'path';
import * as fs from 'fs-extra';
// 自己的库
import FileTool from '../FileTool';
import PromptTool from '../PromptTool';
import ProgressTool from '../ProgressTool';
// 常量
import {
    ROOT_PATH,
} from '../../config';
// 定义
import {
    Result,
} from '../../interface';

/**
 * 图片资源工具类
 */
export default class ImageTool {
    /**
     * 获取文件
     * @param result       [编译结果对象]
     * @param imageExtList [允许复制的图片后缀列表]
     */
    public static getFiles(result: Result, imageExtList: string[]): void {
        // 提示
        PromptTool.info('开始解析Image');
        // 初始化进度条
        ProgressTool.init({
            prefix: 'Image',
            total: 1,
        });
        // 开始解析wxs
        ImageTool.analyze(result, imageExtList, ROOT_PATH, true);
        // 停止进度条
        ProgressTool.stop();
    }

    /**
     * 复制文件到输出目录
     * @param output [输出目录]
     * @param result [编译结果]
     */
    public static async copy(output: string, { imageFiles }: Result): Promise<void> {
        // 获取入口
        const entry = [...imageFiles];

        // 遍历复制
        for (let i = 0, len = entry.length; i < len; i += 1) {
            const filePath = entry[i];
            // 获取目标路径
            const target = FileTool.getCopyTargetPath(output, filePath);
            // 开始复制
            await fs.copy(filePath, target, {
                overwrite: true, // 开启覆盖模式
            });
        }

        // 提示
        PromptTool.log('Image文件复制完成！');
    }

    // ------------------------------私有函数------------------------------
    /**
     * 分析文件
     * @param result       [编译结果对象]
     * @param imageExtList [允许复制的图片后缀列表]
     * @param entry        [待分析的入口路径]
     * @param isInit       [是否是第一次解析]
     */
    private static analyze(
        result: Result, imageExtList: string[], entry: string, isInit = false,
    ): void {
        const {
            imageFiles,
        } = result;

        // 更新总量
        !isInit && ProgressTool.updateTotal(1);

        // 获取目录下的所有文件
        fs.readdirSync(entry).forEach((item) => {
            // 获取后缀
            const ext = path.extname(item);
            const filePath = path.resolve(entry, './', item); // 绝对路径

            // 如果后缀在白名单内
            if (imageExtList.includes(ext)) {
                imageFiles.add(filePath);
            } else if (filePath.indexOf('node_modules') < 0 && fs.statSync(filePath).isDirectory()) {
                // 非node_modules && 对目录进行递归
                ImageTool.analyze(result, imageExtList, filePath);
            }
        });

        // 更新进度
        ProgressTool.update();
    }
}
