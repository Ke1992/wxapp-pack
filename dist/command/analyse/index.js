"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 库
const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer");
// 自己的库
const FileTool_1 = require("../../shared/tools/FileTool");
const ConfigTool_1 = require("../../shared/tools/ConfigTool");
const PromptTool_1 = require("../../shared/tools/PromptTool");
const CommandTool_1 = require("../../shared/tools/CommandTool");
const AnalyseTool_1 = require("../../shared/tools/AnalyseTool");
// 常量
const config_1 = require("../../shared/config");
/**
 * 分析命令
 */
async function async() {
    // 获取最新配置
    const { output, // 输出目录
    before, // 编译前命令
    analyse, // 分析输出目录
    imageExtList, // 允许复制的图片后缀列表
    analyseWhiteList, } = ConfigTool_1.default.init();
    // 校验编译目录是否存在
    if (!fs.existsSync(output)) {
        PromptTool_1.default.error('编译目录不存在');
        return;
    }
    // 执行编译前的命令
    await CommandTool_1.default.execute(before);
    // 获取执行目录的所有文件
    PromptTool_1.default.info('开始获取当前目录所有文件');
    const currentFiles = FileTool_1.default.getAllFile(config_1.ROOT_PATH, config_1.ROOT_PATH + config_1.SEP, imageExtList);
    PromptTool_1.default.log('当前目录解析完成！');
    // 获取编译目录的所有文件
    PromptTool_1.default.info('开始获取编译目录所有文件');
    const outputFiles = FileTool_1.default.getAllFile(output, path.resolve(output) + config_1.SEP, imageExtList);
    PromptTool_1.default.log('编译目录解析完成！');
    // 生成最终分析HTML文件
    PromptTool_1.default.info('开始生成最终分析HTML文件');
    const unusedFiles = AnalyseTool_1.default.getUnusedFiles(currentFiles, outputFiles, analyseWhiteList);
    const filePath = await AnalyseTool_1.default.createAnalyseHtml(unusedFiles, analyse);
    PromptTool_1.default.log('生成分析文件完成！');
    // 打开页面
    const { result, } = await inquirer.prompt({
        name: 'result',
        type: 'confirm',
        message: '是否打开分析文件？',
    });
    result && CommandTool_1.default.openFile(filePath);
}
exports.default = async;
