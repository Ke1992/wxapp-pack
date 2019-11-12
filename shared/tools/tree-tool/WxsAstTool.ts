// 库
import generate from '@babel/generator';
import * as parser from '@babel/parser';
// 自己的库
import AstBase from './AstBase';
// 定义
import {
    TreeItem,
} from '../../interface';

/**
 * WXS AST解析工具类
 */
export default class WxsAstTool extends AstBase {
    /**
     * 获取AST树
     * @param entry [入口路径]
     * @param cache [解析结果缓存]
     */
    public static getAst(entry: string, cache: TreeItem): TreeItem {
        const visited = cache;
        const result: TreeItem = {};

        // 解析wxs文件
        WxsAstTool.getDependencyFromPrecinct(entry, 'commonjs').forEach((item) => {
            const filePath = WxsAstTool.formatFilePath(item, entry, 'wxs');

            // 缓存中不存在，则进行递归
            if (!visited[filePath]) {
                visited[filePath] = {};
                visited[filePath] = WxsAstTool.getAst(filePath, visited);
            }

            // 赋值
            result[filePath] = visited[filePath];
        });

        return result;
    }

    /**
     * 删除注释
     * @param wxs [待删除注释的wxss代码]
     */
    public static removeComment(wxs: string): string {
        // 生成AST树
        const ast = parser.parse(wxs, {
            allowImportExportEverywhere: true, // 允许import和export出现在任意地方
        });

        const {
            code,
        } = generate(ast, {
            // TODO: 为babel压缩增加配置项
            comments: false, // 不包含注释
        });

        return code;
    }
}
