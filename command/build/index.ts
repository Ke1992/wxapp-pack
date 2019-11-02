// 库
import * as path from 'path';
import * as fs from 'fs-extra';
// 自己的库
import {
    JsTool,
} from '../../shared/tools/mini-program';
import BuildTool from '../../shared/tools/BuildTool';
import ConfigTool from '../../shared/tools/ConfigTool';
import PromptTool from '../../shared/tools/PromptTool';
import CommandTool from '../../shared/tools/CommandTool';
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
        invalidFileWhitelist, // 无效文件白名单
    } = ConfigTool.init();

    // 执行编译前的命令
    await CommandTool.execute(before);
    // 执行智能分包逻辑
    // TODO: 后续增加智能分包逻辑
    // 特殊文件sitemap.json
    const sitemapJson = path.resolve(ROOT, 'sitemap.json');
    fs.existsSync(sitemapJson) && result.jsonFiles.add(sitemapJson);
    // 获取所有入口路径
    const entry = BuildTool.getAllEntry(appJs, appJson);

    // 获取js和json
    JsTool.getFiles(entry, result);
    // 编译结束
    PromptTool.info('编译结束');
}
