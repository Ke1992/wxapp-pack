// 库
import * as path from 'path';

// 配置文件名
const CONFIG_FILE_NAME = '.wxapp-pack.json';

// 通用常量
export const SEP = path.sep; // 文件分隔符
export const ROOT = './'; // 根路径（相对路径）
export const ROOT_PATH = path.resolve(ROOT); // 根路径（绝对路径）

// 配置命令常量
export const CONFIG_FILE_PATH = path.resolve(ROOT, CONFIG_FILE_NAME); // 配置文件路径

// 分析命令常量
export const ANALYSE_WHITE_LIST = [CONFIG_FILE_NAME]; // 内部白名单
export const RESULT_FILE_KEY = ['js', 'wxs', 'json', 'wxml', 'wxss', 'image']; // 分析结果对应的KEY
export const ANALYSE_HTML_PATH = path.resolve(__dirname, '../../analyse.html'); // 最终分析HTML文件路径
