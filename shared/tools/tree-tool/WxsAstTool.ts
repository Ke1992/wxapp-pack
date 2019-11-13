// 库
import generate from '@babel/generator';
import * as parser from '@babel/parser';
// 自己的库
import AstBase from './AstBase';
// 定义
import {
    TreeItem,
    BabelGeneratorConfig,
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
     * @param wxs                  [待删除注释的wxss代码]
     * @param babelGeneratorConfig [babel压缩配置]
     */
    public static removeComment(wxs: string, babelGeneratorConfig: BabelGeneratorConfig): string {
        // 生成AST树
        const ast = parser.parse(wxs, {
            allowImportExportEverywhere: true, // 允许import和export出现在任意地方
        });

        const {
            code,
        } = generate(ast, babelGeneratorConfig);

        return code;
    }
}
