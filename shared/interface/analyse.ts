// 分析结果
export interface AnalyseResult {
    js: string[];
    wxs: string[];
    json: string[];
    wxml: string[];
    wxss: string[];
    image: string[];

    // 方便获取数据
    [propName: string]: string[];
}
