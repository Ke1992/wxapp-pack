// 库
import * as _ from 'lodash';
import * as path from 'path';
// 自己的库
import FileTool from '../FileTool';

/**
 * 依赖分析树基础类
 */
export default class AstBase {
    /**
     * 过滤.wxs文件
     * @param entry    [入口路径]
     * @param source   [根据入口路径解析的结果]
     * @param wxsFiles [.wxs文件]
     */
    protected static filterWxsFiles(
        entry: string, source: string[], wxsFiles: Set<string>,
    ): string[] {
        return source.filter((item) => {
            // 获取文件后缀
            const ext = path.extname(item);

            // 后缀是wxs，就加入wxsFiles
            ext === '.wxs' && wxsFiles.add(AstBase.formatFilePath(item, entry, 'wxs'));

            return ext !== '.wxs';
        });
    }

    /**
     * 格式化文件路径
     * @param source [待格式化的路径]
     * @param entry  [入口文件路径]
     * @param type   [文件类型]
     */
    protected static formatFilePath(source: string, entry: string, type: string): string {
        // 获取绝对路径
        let result = FileTool.getAbsolutePath(entry, source);
        // 获取后缀
        const ext = path.extname(result);
        // 没有后缀则补全
        if (_.isEmpty(ext)) {
            result += `.${type}`;
        } else if (type === 'js' && ext !== '.js' && ext !== '.json') {
            // 兼容.min类似的情况
            // TODO: 这里这样替换是否可能存在隐患？
            result += `.${type}`;
        }
        // 返回结果
        return result;
    }

    /**
     * 格式化模块依赖关系数据
     * @param entry  [入口文件路径]
     * @param source [依赖文件]
     * @param type   [文件类型]
     */
    protected static formatGraphData(entry: string, source: string[], type: string): string[] {
        return source.map((item) => AstBase.formatFilePath(item, entry, type));
    }
}
