"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 库
const path = require("path");
const fs = require("fs-extra");
// 自己的库
const mini_program_1 = require("../../shared/tools/mini-program");
const BuildTool_1 = require("../../shared/tools/BuildTool");
const ConfigTool_1 = require("../../shared/tools/ConfigTool");
const PromptTool_1 = require("../../shared/tools/PromptTool");
const CommandTool_1 = require("../../shared/tools/CommandTool");
const CompileTool_1 = require("../../shared/tools/CompileTool");
// 常量
const config_1 = require("../../shared/config");
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
async function build(smart = false) {
    // 编译结果
    const result = {
        jsFiles: new Set(),
        wxsFiles: new Set(),
        jsonFiles: new Set(),
        wxmlFiles: new Set(),
        wxssFiles: new Set(),
        imageFiles: new Set(),
        invalidFiles: {
            files: {},
            list: new Set(),
        },
    };
    // 初始入口文件
    const appJs = path.resolve(config_1.ROOT, 'app.js');
    const appJson = path.resolve(config_1.ROOT, 'app.json');
    // 校验app.js是否存在
    if (!fs.existsSync(appJs)) {
        // 不存在，直接提示
        PromptTool_1.default.error('当前环境不存在app.js文件！请重新确认！');
        return;
    }
    // 校验app.json是否存在
    if (!fs.existsSync(appJson)) {
        // 不存在，直接提示
        PromptTool_1.default.error('当前环境不存在app.json文件！请重新确认！');
        return;
    }
    // 获取最新配置
    const { before, // 编译前命令
    invalidFileWhitelist, } = ConfigTool_1.default.init();
    // 执行编译前的命令
    await CommandTool_1.default.execute(before);
    // 执行智能分包逻辑
    // TODO: 后续增加智能分包逻辑
    // 特殊文件sitemap.json
    const sitemapJson = path.resolve(config_1.ROOT, 'sitemap.json');
    fs.existsSync(sitemapJson) && result.jsonFiles.add(sitemapJson);
    // 获取所有入口路径
    const entry = BuildTool_1.default.getAllEntry(appJs, appJson);
    // 获取js和json
    mini_program_1.JsTool.getFiles(entry, result);
    // 获取wxml
    mini_program_1.WxmlTool.getFiles(result);
    // 获取wxs
    mini_program_1.WxsTool.getFiles(result);
    // 获取wxss
    mini_program_1.WxssTool.getFiles(result, appJs);
    // 获取所有图片资源
    mini_program_1.ImageTool.getFiles(result);
    // 执行编译任务
    await CompileTool_1.default.build(result);
    // 编译结束
    PromptTool_1.default.info('编译结束');
}
exports.default = build;
