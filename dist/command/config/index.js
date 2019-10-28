"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 自己的库
const ConfigTool_1 = require("../../shared/tools/ConfigTool");
const PromptTool_1 = require("../../shared/tools/PromptTool");
/**
 * 配置命令
 */
async function config() {
    // 更新配置数据
    await ConfigTool_1.default.update();
    // 更新结束
    PromptTool_1.default.info('更新编译配置成功！');
}
exports.default = config;
