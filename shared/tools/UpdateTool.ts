// 库
import chalk from 'chalk';
import * as https from 'https';
// 自己的库
import ConfigTool from './ConfigTool';

/**
 * 文件操作工具类
 */
export default class UpdateTool {
    /**
     * 展示版本更新信息
     * @param version [当前版本号]
     */
    public static async show(version: string): Promise<void> {
    // 获取最新配置
        const {
            showUpdateTips,
        } = ConfigTool.init();

        // 配置了不允许展示更新信息则直接返回
        if (!showUpdateTips) {
            return;
        }

        // 获取最新的版本号
        const remote = await UpdateTool.getRemoteVersion();

        // 没有新版本，直接返回
        if (!UpdateTool.compare(version, remote)) {
            return;
        }

        const line = chalk.yellow('│');
        const spacing = '             ';
        const prefix = spacing.slice(0, 13 + '0.0.0'.length - version.length);
        const suffix = spacing.slice(0, 13 + '0.0.0'.length - remote.length);

        console.log(`

    ${chalk.yellow('╭────────────────────────────────────────────────────────────────────────────╮')}
    ${chalk.yellow('│                                                                            │')}
    ${line + prefix}New version of wxapp-pack available! ${chalk.red(version)} → ${chalk.green(remote)}${suffix + line}
    ${line}  Changelog: https://github.com/Ke1992/wxapp-pack/blob/master/CHANGELOG.md  ${line}
    ${line}                  Run ${chalk.green('npm install -g wxapp-pack')} to update!                  ${line}
    ${chalk.yellow('│                                                                            │')}
    ${chalk.yellow('╰────────────────────────────────────────────────────────────────────────────╯')}

        `);
    }

    // ------------------------------私有函数------------------------------
    /**
     * 获取最新的版本号
     */
    private static async getRemoteVersion(): Promise<string> {
        const degrade = '0.0.0';

        // 请求版本号
        return new Promise((resolve) => {
            https.get('https://raw.githubusercontent.com/Ke1992/wxapp-pack/master/package.json', (res) => {
                res.setEncoding('utf8');

                let content = '';
                res.on('data', (chunk) => { content += chunk; });
                res.on('end', () => {
                    try {
                        const {
                            version,
                        } = JSON.parse(content);

                        resolve(version);
                    } catch (error) {
                        resolve(degrade);
                    }
                });
            }).on('error', () => {
                resolve(degrade);
            });
        });
    }

    /**
     * 比较版本号，确定是否需要提示
     * @param current [当前版本号]
     * @param remote  [最新的版本号]
     */
    private static compare(current: string, remote: string): boolean {
        const ver1 = current.split('.'); // 当前版本
        const ver2 = remote.split('.'); // 最新版本

        // 比较大小
        for (let i = 0; i < 3; i += 1) {
            // 如果当前版本小于最新版本，则直接返回
            if (parseInt(ver1[i], 10) < parseInt(ver2[i], 10)) {
                return true;
            }
        }

        return false;
    }
}
