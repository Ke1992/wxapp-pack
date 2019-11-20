#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 库
const program = require("commander");
// 命令脚本
const command_1 = require("./command");
// 配置
const { version, } = require('../package.json'); // eslint-disable-line
// 注册版本号
program
    .version(version, '-v, --version');
// 注册编译命令
program
    .command('build')
    .alias('b')
    .option('-s, --smart', '启用智能分包')
    .description('使用模块依赖分析模式编译项目')
    .action(({ smart }) => {
    command_1.build(smart);
});
// 注册分析命令
program
    .command('analyse')
    .alias('a')
    .description('分析未使用文件、绘制模块依赖图（强依赖Graphviz）')
    .action(() => {
    command_1.analyse();
});
// 注册配置命令
program
    .command('config')
    .alias('c')
    .description('更新编译配置')
    .action(() => {
    command_1.config();
});
// 没有输入任何命令，则输出help
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
// 注册工具
program.parse(process.argv);
