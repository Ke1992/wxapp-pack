// 库
import generate from '@babel/generator';
import * as parser from '@babel/parser';
// 自己的库
import AstBase from './AstBase';
import JsAstTool from './JsAstTool';
// 定义
import {
    TreeItem,
    AnalyseGraph,
    BabelGeneratorConfig,
} from '../../interface';
// 变量
const visited: TreeItem = {};
const graph: AnalyseGraph = {};

/**
 * WXS AST解析工具类
 */
export default class WxsAstTool extends AstBase {
    /**
     * 获取AST树
     * @param entry [入口路径]
     */
    public static getAst(entry: string): TreeItem {
        const result: TreeItem = {};

        // 获取解析结果
        const source = JsAstTool.getDependency(entry);
        // 缓存解析结果
        graph[entry] = WxsAstTool.formatGraphData(entry, source, 'wxs');

        // 解析wxs文件
        source.forEach((item) => {
            const filePath = WxsAstTool.formatFilePath(item, entry, 'wxs');

            // 缓存中不存在，则进行递归
            if (!visited[filePath]) {
                visited[filePath] = {};
                visited[filePath] = WxsAstTool.getAst(filePath);
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

    /**
     * 获取模块依赖关系
     */
    public static getGraph(): AnalyseGraph {
        return graph;
    }
}
