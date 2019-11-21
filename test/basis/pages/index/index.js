// 测试普通的import
import importData from '../../models/import.js';
// 测试.min场景
import minSuffixData from '../../tools/suffix.min';

// 测试 export { x } from 'xx'的场景
import { namedData } from '../../models/export_named';
// 测试 export * from 'xx'的场景
import * as exportAllData from '../../models/export_all';

// 测试循环引用（import）
import loopImportData from '../../models/loop/import_a';

// 测试循环引用（require）
const loopRequireData = require('../../models/loop/require_a');

// 测试普通require
const requireData = require('../../models/require.js');
// 测试require不存在文件
false && require('../../models/require2');

Page({
    data: {
        importData,
        importData2: `${importData} in any position`,

        exportNamedData: namedData,
        exportAllData: exportAllData.allData,

        minSuffixData,
        workerData: '',

        requireData: requireData.data,
        // 测试require任意位置（同时测试省略后缀）
        requireData3: `${require('../../models/require').data} in any position`,

        loopImportData: `loop：${loopImportData}`,
        loopRequireData: `loop：${loopRequireData.data}`,
    },
    onLoad() {
        // 测试worker
        const worker = wx.createWorker('tools/workers/index.js');
        // 接收消息（需要真机才能测试）
        worker.onMessage((res) => {
            this.setData({
                workerData: res.data,
            });
        });
        // 发送消息
        worker.postMessage({
            msg: 'hello worker',
        });
    },
});

// 测试import任意位置
import importData2 from '../../models/import'; // eslint-disable-line