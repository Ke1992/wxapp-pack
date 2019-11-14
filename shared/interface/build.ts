// 定义
import {
    TerserConfig,
    BabelGeneratorConfig,
} from './config';

// 无效文件
export interface InvalidFiles {
    files: {
        [propName: string]: string[];
    };
    list: Set<string>;
}

// 编译结果
export interface Result {
    jsFiles: Set<string>;
    wxsFiles: Set<string>;
    jsonFiles: Set<string>;
    wxmlFiles: Set<string>;
    wxssFiles: Set<string>;
    imageFiles: Set<string>;
    invalidFiles: InvalidFiles;
}

// 进度条初始化选项
export interface ProgressOption {
    total: number;
    prefix: string;
}

// AST树解析项
export interface TreeItem {
    [propName: string]: {
        [propName: string]: TreeItem;
    };
}

// AST树解析结果
export interface TreeResult {
    wxs: Set<string>;
    tree: TreeItem;
}

// AST树参数配置
export interface TreeConfig {
    terser?: TerserConfig;
    generator?: BabelGeneratorConfig;
}

// precinct库参数
export interface PrecinctOptions {
    type?: string;
    es6?: {
        mixedImports: boolean;
    };
}
