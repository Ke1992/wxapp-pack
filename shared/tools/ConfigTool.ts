// 库
import * as _ from 'lodash';
import * as fs from 'fs-extra';
import * as inquirer from 'inquirer';
// 常量
import {
    CONFIG_FILE_PATH,
} from '../config';
// 定义
import {
    ConfigData,
    ConfigTask,
} from '../interface';

/**
 * 配置命令工具类
 */
export default class ConfigTool {
    /**
     * 初始化配置数据
     */
    public static init(): ConfigData {
        const config: ConfigData = {
            // 编译相关配置
            before: '', // 编译前需要执行的命令
            output: '../wxapp-pack-dist', // 输出目录
            analyse: '../wxapp-pack-analyse', // 分析文件输出目录
            smartDirName: 'smart-common', // 智能分包目录名
            imageExtList: ['.jpg', '.png', '.gif'], // 允许复制的图片后缀列表

            // 压缩相关配置
            terserConfig: { // JS压缩配置（https://www.npmjs.com/package/terser#api-reference）
                mangle: false,
                compress: false,
            },
            babelGeneratorConfig: { // babel压缩配置（https://babeljs.io/docs/en/babel-generator）
                comments: false, // 不包含注释
            },

            // 分析相关配置
            analyseWhiteList: [], // 未使用文件白名单（analyse命令用）
            invalidFileWhitelist: [], // 无效文件白名单（build命令用）
        };

        // 如果存在配置文件，则读取配置
        if (fs.existsSync(CONFIG_FILE_PATH)) {
            // 获取存在的配置
            const source = fs.readJsonSync(CONFIG_FILE_PATH);
            // 更新配置
            _.forEach(source, (value, key) => {
                config[key] = value;
            });
        }
        // 不论是否存在都写配置文件
        ConfigTool.save(config);

        return config;
    }

    /**
     * 更新配置数据
     */
    public static async update(): Promise<void> {
        // 获取最新的配置数据
        const config = ConfigTool.init();
        // 获取相关配置数据
        const {
            before,
            output,
            analyse,
            smartDirName,
        } = config;

        // 定义任务
        const tasks: ConfigTask[] = [{
            type: 'input',
            key: 'before',
            message: '请输入新的编译前命令（编译前会执行该命令）：',
            tips: `当前编译前命令为${before || '空'}，是否需要修改?`,
        }, {
            type: 'input',
            key: 'output',
            message: '请输入新的输出目录：',
            tips: `当前输出目录为${output}，是否需要修改?`,
        }, {
            type: 'input',
            key: 'analyseOutput',
            message: '请输入新的分析文件输出目录：',
            tips: `当前分析文件输出目录为${analyse}，是否需要修改?`,
        }, {
            type: 'input',
            key: 'smartDirName',
            message: '请输入新的智能分包目录名：',
            tips: `当前智能分包目录名为${smartDirName}，是否需要修改?`,
        }];

        // 遍历执行任务
        for (let i = 0, len = tasks.length; i < len; i += 1) {
            // 获取key
            const {
                key,
            } = tasks[i];
            // 获取最新的配置
            const data = await ConfigTool.run(tasks[i]);
            // 如果有修改，则更新
            if (!_.isNull(data)) {
                config[key] = data;
            }
        }

        // 将最新数据写入本地文件
        ConfigTool.save(config);
    }

    // ------------------------------私有函数------------------------------
    /**
     * 将配置数据保存到本地文件
     * @param config [配置数据]
     */
    private static save(config: ConfigData): void {
        // 格式化数据
        const content = JSON.stringify(config, null, '  ');
        // 写入文件
        fs.writeFileSync(CONFIG_FILE_PATH, content);
    }

    /**
     * 执行任务
     * @param task [待执行的任务]
     */
    private static async run(task: ConfigTask): Promise<string> {
        // 获取配置项
        const {
            type,
            tips,
            message,
        } = task;

        // 先询问是否需要更新
        const {
            result,
        } = await inquirer.prompt({
            name: 'result',
            type: 'confirm',
            message: tips,
        });

        // 不需要更新
        if (!result) {
            return null;
        }

        // 输入类型
        if (type === 'input') {
            const {
                data,
            } = await inquirer.prompt({
                name: 'data',
                type,
                message,
            });
            return data;
        }

        // 兜底
        return null;
    }
}
