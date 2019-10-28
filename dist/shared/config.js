"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 库
const path = require("path");
// 通用常量
exports.SEP = path.sep; // 文件分隔符
exports.ROOT = './'; // 根路径（相对路径）
exports.ROOT_PATH = path.resolve(exports.ROOT); // 根路径（绝对路径）
// 配置常量
exports.CONFIG_FILE_PATH = path.resolve(exports.ROOT, '.wxapp-pack.json'); // 配置文件路径
