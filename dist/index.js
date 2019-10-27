#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
// 配置
const { version, } = require('../package.json'); // eslint-disable-line
// 注册版本号
program
    .version(version, '-v, --version');
// 没有输入任何命令，则输出help
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
// 注册工具
program.parse(process.argv);
