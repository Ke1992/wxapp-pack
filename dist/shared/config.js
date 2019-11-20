"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 库
const path = require("path");
// 配置文件名
const CONFIG_FILE_NAME = '.wxapp-pack.json';
// 通用常量
exports.SEP = path.sep; // 文件分隔符
exports.ROOT = './'; // 根路径（相对路径）
exports.ROOT_PATH = path.resolve(exports.ROOT); // 根路径（绝对路径）
// 配置命令常量
exports.CONFIG_FILE_PATH = path.resolve(exports.ROOT, CONFIG_FILE_NAME); // 配置文件路径
// 分析命令常量
exports.ANALYSE_WHITE_LIST = [CONFIG_FILE_NAME]; // 内部白名单
exports.RESULT_FILE_KEY = ['js', 'wxs', 'json', 'wxml', 'wxss', 'image']; // 分析结果对应的KEY
exports.ANALYSE_HTML_PATH = path.resolve(__dirname, '../../analyse.html'); // 最终分析HTML文件路径
