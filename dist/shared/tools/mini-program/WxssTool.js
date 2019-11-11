"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 库
const fs = require("fs-extra");
const postcss = require("postcss");
// 自己的库
const FileTool_1 = require("../FileTool");
const tree_tool_1 = require("../tree-tool");
const PromptTool_1 = require("../PromptTool");
const ProgressTool_1 = require("../ProgressTool");
/**
 * WXSS文件工具类
 */
class WxssTool {
    /**
     * 获取文件
     * @param result [编译结果对象]
     */
    static getFiles(result, appJs) {
        // 提示
        PromptTool_1.default.info('开始解析WXSS');
        // 开始解析wxss
        WxssTool.analyze(result, appJs);
        // 停止进度条
        ProgressTool_1.default.stop();
    }
    /**
     * 复制文件到输出目录
     * @param output [输出目录]
     * @param result [编译结果]
     */
    static async copy(output, { wxssFiles }) {
        // 获取入口
        const entry = [...wxssFiles];
        // 遍历复制
        for (let i = 0, len = entry.length; i < len; i += 1) {
            const filePath = entry[i];
            // 读取文件内容
            const content = await FileTool_1.default.readFileAsync(filePath);
            // 移除注释
            const code = WxssTool.removeComment(content);
            // 获取目标路径
            const target = FileTool_1.default.getCopyTargetPath(output, filePath);
            // 开始复制
            await fs.outputFile(target, code);
        }
        // 提示
        PromptTool_1.default.log('WXSS文件复制完成！');
    }
    // ------------------------------私有函数------------------------------
    /**
     * 分析文件
     * @param result [编译结果对象]
     */
    static analyze({ wxmlFiles, wxssFiles, invalidFiles }, appJS) {
        // 所有待分析的入口
        const entry = new Set();
        // 特殊处理app.wxss（因为不存在app.wxml）
        const appWxss = FileTool_1.default.replaceExt(appJS, '.wxss');
        fs.existsSync(appWxss) && entry.add(appWxss);
        // 遍历获取所有wxss文件
        wxmlFiles.forEach((item) => {
            const filePath = FileTool_1.default.replaceExt(item, '.wxss');
            // 检查wxss文件是否存在
            fs.existsSync(filePath) && entry.add(filePath);
        });
        // 初始化进度条
        ProgressTool_1.default.init({
            prefix: 'WXSS',
            total: entry.size,
        });
        // 遍历获取
        entry.forEach((item) => {
            // 获取依赖分析树
            tree_tool_1.default.toList(item).forEach((filePath) => {
                // 校验文件是否存在
                if (!FileTool_1.default.checkExists(item, filePath, invalidFiles)) {
                    return;
                }
                wxssFiles.add(filePath);
            });
            // 更新进度
            ProgressTool_1.default.update();
        });
    }
    /**
     * 删除注释
     * @param wxss [待删除注释的css代码]
     */
    static removeComment(wxss) {
        // 先格式化一次，再解析成ast树
        const ast = postcss.parse(wxss);
        // 遍历注释并删除
        ast.walkComments((comment) => {
            comment.remove();
        });
        // 返回删除后的代码
        return ast.toString();
    }
}
exports.default = WxssTool;
