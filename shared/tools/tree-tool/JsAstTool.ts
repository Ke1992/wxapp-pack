// 库
import * as terser from 'terser';
// 自己的库
import AstBase from './AstBase';
// 定义
import {
    TreeItem,
    TerserConfig,
} from '../../interface';

/**
 * JS AST解析工具类
 */
export default class JsAstTool extends AstBase {
    /**
     * 获取AST树
     * @param entry    [入口路径]
     * @param cache    [解析结果缓存]
     * @param wxsFiles [.wxs文件]
     */
    public static getAst(entry: string, cache: TreeItem, wxsFiles: Set<string>): TreeItem {
        const visited = cache;
        const result: TreeItem = {};

        // 获取解析结果
        const source = JsAstTool.getDependencyFromPrecinct(entry, 'es6');

        // 过滤.wxs文件
        JsAstTool.filterWxsFiles(entry, source, wxsFiles).forEach((item) => {
            const filePath = JsAstTool.formatFilePath(item, entry, 'js');

            // 缓存中不存在，则进行递归
            if (!visited[filePath]) {
                // TODO: 怎么解决死循环的问题，暂时全部都先用空对象来解决
                visited[filePath] = {};
                visited[filePath] = JsAstTool.getAst(filePath, visited, wxsFiles);
            }

            // 赋值
            result[filePath] = visited[filePath];
        });

        return result;
    }

    /**
     * 删除注释
     * @param js           [待删除注释的js代码]
     * @param terserConfig [JS压缩配置]
     */
    public static removeComment(js: string, terserConfig: TerserConfig): string {
        // 压缩代码
        const {
            code,
            error,
        } = terser.minify(js, terserConfig);

        // 如果出现异常，直接抛出
        if (error) {
            throw error;
        }

        return code;
    }
}
