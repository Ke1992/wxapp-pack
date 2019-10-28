// 库
import * as path from 'path';

// 通用常量
export const SEP = path.sep; // 文件分隔符
export const ROOT = './'; // 根路径（相对路径）
export const ROOT_PATH = path.resolve(ROOT); // 根路径（绝对路径）

// 配置常量
export const CONFIG_FILE_PATH = path.resolve(ROOT, '.wxapp-pack.json');// 配置文件路径
