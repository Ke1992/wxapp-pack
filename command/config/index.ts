// 自己的库
import ConfigTool from '../../shared/tools/ConfigTool';
import PromptTool from '../../shared/tools/PromptTool';

// 配置命令
export default async function config(): Promise<void> {
    // 更新配置数据
    await ConfigTool.update();
    // 更新结束
    PromptTool.info('更新编译配置成功！');
}
