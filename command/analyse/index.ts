// 库
import * as path from 'path';
import * as fs from 'fs-extra';
import * as inquirer from 'inquirer';
// 自己的库
import FileTool from '../../shared/tools/FileTool';
import ConfigTool from '../../shared/tools/ConfigTool';
import PromptTool from '../../shared/tools/PromptTool';
import CommandTool from '../../shared/tools/CommandTool';
import AnalyseTool from '../../shared/tools/AnalyseTool';
// 常量
import {
    SEP,
    ROOT_PATH,
} from '../../shared/config';

/**
 * 分析命令
 */
export default async function async(nograph = false): Promise<void> {
    // 获取最新配置
    const {
        output, // 输出目录
        before, // 编译前命令
        analyse, // 分析输出目录
        imageExtList, // 允许复制的图片后缀列表
        analyseWhiteList, // 未使用文件白名单
    } = ConfigTool.init();

    // 校验编译目录是否存在
    if (!fs.existsSync(output)) {
        PromptTool.error('编译目录不存在');
        return;
    }

    // 执行编译前的命令
    await CommandTool.execute(before);

    // 获取执行目录的所有文件
    PromptTool.info('开始获取当前目录所有文件');
    const currentFiles = FileTool.getAllFile(ROOT_PATH, ROOT_PATH + SEP, imageExtList);
    PromptTool.log('当前目录解析完成！');

    // 获取编译目录的所有文件
    PromptTool.info('开始获取编译目录所有文件');
    const outputFiles = FileTool.getAllFile(output, path.resolve(output) + SEP, imageExtList);
    PromptTool.log('编译目录解析完成！');

    // 绘制模块依赖关系图
    const graph = nograph ? 'null' : AnalyseTool.generateModuleGraph();

    // 生成最终分析HTML文件
    PromptTool.info('开始生成最终分析HTML文件');
    const unusedFiles = AnalyseTool.getUnusedFiles(currentFiles, outputFiles, analyseWhiteList);
    const filePath = await AnalyseTool.createAnalyseHtml(unusedFiles, analyse, graph);
    PromptTool.log('生成分析文件完成！');

    // 打开页面
    const {
        result,
    } = await inquirer.prompt({
        name: 'result',
        type: 'confirm',
        message: '是否打开分析文件？',
    });
    result && CommandTool.openFile(filePath);
}
