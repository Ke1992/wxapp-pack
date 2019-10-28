#!/usr/bin/env node
// 库
import * as program from 'commander';
// 命令脚本
import {
    build,
    config,
} from './command';

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
    .description('使用模块依赖分析模式编译项目')
    .action(() => {
        build();
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
