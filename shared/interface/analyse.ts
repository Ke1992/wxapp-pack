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

// 模块分析图
export interface AnalyseGraph {
    [propName: string]: string[];
}

// 模块分析结果
export interface AnalyseGraphResult {
    js: AnalyseGraph;
    wxs: AnalyseGraph;
    json: AnalyseGraph;
    wxml: AnalyseGraph;
    wxss: AnalyseGraph;
}
