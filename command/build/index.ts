// 库
import * as path from 'path';
import * as fs from 'fs-extra';
// 自己的库
import {
    JsTool,
    WxsTool,
    WxmlTool,
    WxssTool,
    ImageTool,
} from '../../shared/tools/mini-program';
import BuildTool from '../../shared/tools/BuildTool';
import ConfigTool from '../../shared/tools/ConfigTool';
import PromptTool from '../../shared/tools/PromptTool';
import CommandTool from '../../shared/tools/CommandTool';
import CompileTool from '../../shared/tools/CompileTool';
// 常量
import {
    ROOT,
} from '../../shared/config';
// 定义
import {
    Result,
} from '../../shared/interface';

/**
 * 编译命令
 * @param smart [是否启用智能分包逻辑]
 * 编译命令，步骤如下：
 *    1、根据入口文件解析JS
 *    2、解析JSON，然后循环解析JS、JSON
 *    3、根据JS文件获取所有的WXML文件
 *    4、解析WXML
 *    5、在1、2、4中获取依赖的WXS文件
 *    6、解析WXS文件
 *    7、根据WXML获取WXSS文件
 */
// TODO: 需要考虑require的使用场景
export default async function build(smart = false): Promise<void> {
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

    // 校验app.js是否存在
    if (!fs.existsSync(appJs)) {
        // 不存在，直接提示
        PromptTool.error('当前环境不存在app.js文件！请重新确认！');
        return;
    }
    // 校验app.json是否存在
    if (!fs.existsSync(appJson)) {
        // 不存在，直接提示
        PromptTool.error('当前环境不存在app.json文件！请重新确认！');
        return;
    }

    // 获取最新配置
    const {
        before, // 编译前命令
        imageExtList, // 允许复制的图片后缀列表
        invalidFileWhitelist, // 无效文件白名单
    } = ConfigTool.init();

    // 执行编译前的命令
    await CommandTool.execute(before);
    // 执行智能分包逻辑
    // TODO: 后续增加智能分包逻辑

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
    // 获取所有图片资源
    ImageTool.getFiles(result, imageExtList);
    // 执行编译任务
    await CompileTool.build(result);
    // 输出无效文件
    BuildTool.output(result, invalidFileWhitelist);
    // 编译结束
    PromptTool.info('编译结束');
}
