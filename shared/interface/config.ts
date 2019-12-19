// JS压缩配置（https://www.npmjs.com/package/terser#api-reference）
export interface TerserConfig {
    mangle: boolean;
    compress: boolean;
}

// babel压缩配置（https://babeljs.io/docs/en/babel-generator）
export interface BabelGeneratorConfig {
    comments: boolean;
}

// 配置数据
export interface ConfigData {
    // 编译相关配置
    before: string; // 编译前需要执行的命令
    output: string; // 输出目录
    analyse: string; // 分析文件输出目录
    smartDirName: string; // 智能分包目录名
    imageExtList: string[]; // 允许复制的图片后缀列表
    showUpdateTips: boolean; // 是否允许提示更新信息

    // 压缩相关配置
    terserConfig: TerserConfig;
    babelGeneratorConfig: BabelGeneratorConfig;

    // 分析相关配置
    analyseWhiteList: string[]; // 未使用文件白名单（analyse命令用）
    invalidFileWhitelist: string[]; // 无效文件白名单（build命令用）

    // 方便更新数据
    [propName: string]: TerserConfig | BabelGeneratorConfig | string | string[] | boolean;
}

// 配置任务项
export interface ConfigTask {
    key: string;
    type: string;
    tips: string;
    message: string;
}
