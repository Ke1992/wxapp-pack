#!/usr/bin/env node
// 库
import * as program from 'commander';
// 命令脚本
import {
    build,
    config,
    analyse,
} from './command';
// 自己的库
import UpdateTool from './shared/tools/UpdateTool';

// 配置
const {
    version, // 当前工具版本号
} = require('../package.json'); // eslint-disable-line

// 注册版本号
program
    .version(version, '-v, --version');

// 注册编译命令
program
    .command('build')
    .alias('b')
    .option('-s, --smart', '启用智能分包')
    .description('使用文件依赖分析模式编译项目')
    .action(async ({ smart }) => {
        await build(smart);
        await UpdateTool.show(version);
    });

// 注册分析命令
program
    .command('analyse')
    .alias('a')
    .option('-n, --nograph', '不绘制文件依赖图')
    .description('分析未使用文件、绘制文件依赖图')
    .action(async ({ nograph }) => {
        await analyse(nograph);
        await UpdateTool.show(version);
    });

// 注册配置命令
program
    .command('config')
    .alias('c')
    .description('更新编译配置')
    .action(() => {
        config();
    });

// 没有输入任何命令，则输出help
if (!process.argv.slice(2).length) {
    program.outputHelp();
}

// 注册工具
program.parse(process.argv);
