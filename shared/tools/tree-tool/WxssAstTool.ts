// 库
import * as fs from 'fs-extra';
import * as postcss from 'postcss';
// 自己的库
import AstBase from './AstBase';
// 定义
import {
    TreeItem,
    AnalyseGraph,
} from '../../interface';
// 变量
const visited: TreeItem = {};
const graph: AnalyseGraph = {};

/**
 * WXSS AST解析工具类
 */
export default class WxssAstTool extends AstBase {
    /**
     * 获取AST树
     * @param entry [入口路径]
     */
    public static getAst(entry: string): TreeItem {
        const result: TreeItem = {};

        // 获取解析结果
        const source = WxssAstTool.getDependency(entry);
        // 缓存解析结果
        graph[entry] = WxssAstTool.formatGraphData(entry, source, 'wxss');

        // 解析wxss文件
        source.forEach((item) => {
            const filePath = WxssAstTool.formatFilePath(item, entry, 'wxss');

            // 缓存中不存在，则进行递归
            if (!visited[filePath]) {
                visited[filePath] = {};
                visited[filePath] = WxssAstTool.getAst(filePath);
            }

            // 赋值
            result[filePath] = visited[filePath];
        });

        return result;
    }

    /**
     * 删除注释
     * @param wxss [待删除注释的wxss代码]
     */
    public static removeComment(wxss: string): string {
        // 先格式化一次，再解析成ast树
        const ast = postcss.parse(wxss);
        // 遍历注释并删除
        ast.walkComments((comment) => {
            comment.remove();
        });
        // 返回删除后的代码
        return ast.toString();
    }

    /**
     * 获取模块依赖关系
     */
    public static getGraph(): AnalyseGraph {
        return graph;
    }

    // ------------------------------私有函数------------------------------
    /**
     * 获取依赖文件
     * @param filePath [文件路径]
     */
    private static getDependency(filePath: string): string[] {
        // 包含wxs文件的结果
        const result = new Set<string>();

        // 如果文件不存在，则直接返回空
        if (!fs.existsSync(filePath)) {
            return [];
        }

        // 获取文件内容
        const content = fs.readFileSync(filePath, 'utf8');
        // 生成ast树
        const ast = postcss.parse(content);
        // 遍历import声明
        ast.walkAtRules('import', (rule) => {
            const src = rule.params.slice(1, -1);
            // 值存在才加入结果
            src && result.add(src);
        });
        // 返回结果
        return [...result];
    }
}
