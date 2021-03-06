// 库
import * as _ from 'lodash';
import * as path from 'path';
// 自己的库
import {
    JsonTool,
} from '../mini-program';
import JsAstTool from './JsAstTool';
import WxsAstTool from './WxsAstTool';
import WxmlAstTool from './WxmlAstTool';
import WxssAstTool from './WxssAstTool';
// 定义
import {
    TreeItem,
    TreeResult,
    TreeConfig,
    AnalyseGraphResult,
} from '../../interface';
// 变量
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

    /**
     * 删除注释
     * @param source [待删除注释的代码]
     * @param type   [代码类型]
     * @param config [babel压缩配置]
     */
    public static removeComment(source: string, type: string, config: TreeConfig = {}): string {
        const {
            terser,
            generator,
        } = config;

        if (type === 'js') {
            return JsAstTool.removeComment(source, terser);
        }
        if (type === 'wxs') {
            return WxsAstTool.removeComment(source, generator);
        }
        if (type === 'wxss') {
            return WxssAstTool.removeComment(source);
        }
        if (type === 'wxml') {
            return WxmlAstTool.removeComment(source);
        }

        // 兜底
        return source;
    }

    /**
     * 获取模块依赖关系
     */
    public static getGraph(): AnalyseGraphResult {
        return {
            js: JsAstTool.getGraph(),
            json: JsonTool.getGraph(),
            wxs: WxsAstTool.getGraph(),
            wxml: WxmlAstTool.getGraph(),
            wxss: WxssAstTool.getGraph(),
        };
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
                [entry]: JsAstTool.getAst(entry, wxsFiles),
            };
        }

        // 解析WXML
        if (ext === '.wxml') {
            return {
                [entry]: WxmlAstTool.getAst(entry, wxsFiles),
            };
        }

        // 解析WXS
        if (ext === '.wxs') {
            return {
                [entry]: WxsAstTool.getAst(entry),
            };
        }

        // 解析WXSS
        if (ext === '.wxss') {
            return {
                [entry]: WxssAstTool.getAst(entry),
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
