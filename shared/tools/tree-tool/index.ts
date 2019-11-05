// 库
import * as _ from 'lodash';
import * as path from 'path';
// 自己的库
import JsAstTool from './JsAstTool';
import WxsAstTool from './WxsAstTool';
import WxmlAstTool from './WxmlAstTool';
import WxssAstTool from './WxssAstTool';
// 定义
import {
    TreeItem,
    TreeResult,
} from '../../interface';
// 变量
const visited: TreeItem = {};
let wxsFiles: Set<string>;

/**
 * 依赖分析树工具类
 */
export default class TreeTool {
    /**
     * AST树展开成数组
     * @param entry [入口路径]
     */
    public static toList(entry: string): string[] {
        // 校验空值
        if (_.isEmpty(entry)) {
            return [];
        }

        // 获取AST树
        const data = TreeTool.init(entry);
        // 展开AST树
        const result = TreeTool.formatTreeToArray(data.tree);

        // 返回数据
        return [...result].concat(...data.wxs);
    }

    // ------------------------------私有函数------------------------------
    /**
     * 根据入口解析AST树
     * @param entry [入口路径]
     */
    private static init(entry: string): TreeResult {
        // 重置数据
        wxsFiles = new Set<string>();
        // 开始解析依赖树
        return {
            wxs: wxsFiles, // wxs结果
            tree: TreeTool.getAstTree(entry), // AST树
        };
    }

    /**
     * 获取AST树
     * @param entry [入口路径]
     */
    private static getAstTree(entry: string): TreeItem {
        // 获取后缀
        const ext = path.extname(entry);

        // 解析JS
        if (ext === '.js') {
            return {
                [entry]: JsAstTool.getAst(entry, visited, wxsFiles),
            };
        }

        // 解析WXML
        if (ext === '.wxml') {
            return {
                [entry]: WxmlAstTool.getAst(entry, visited, wxsFiles),
            };
        }

        // 解析WXS
        if (ext === '.wxs') {
            return {
                [entry]: WxsAstTool.getAst(entry, visited),
            };
        }

        // 解析WXSS
        if (ext === '.wxss') {
            return {
                [entry]: WxssAstTool.getAst(entry, visited),
            };
        }

        // 兜底
        return {};
    }

    /**
     * 将AST展开成数组
     * @param source [AST数据源]
     */
    private static formatTreeToArray(source: TreeItem): Set<string> {
        const result = new Set<string>();

        // 遍历获取
        _.forEach(source, (value, key) => {
            result.add(key);

            // 递归
            TreeTool.formatTreeToArray(value).forEach((item) => {
                result.add(item);
            });
        });

        return result;
    }
}
