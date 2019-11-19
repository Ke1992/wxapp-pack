// 测试普通的import
import importData from '../../models/import.js';
// 测试.min场景
import minSuffixData from '../../tools/suffix.min';

// 测试 export { x } from 'xx'的场景
import { namedData } from '../../models/exportNamed';
// 测试 export * from 'xx'的场景
import * as exportAllData from '../../models/exportAll';

// 测试循环引用（import）
import loopImportData from '../../models/loop/import_a';

// 测试循环引用（require）
const loopRequireData = require('../../models/loop/require_a');

// 测试引入wxs文件
const wxsData = require('../../tools/wxs');
// 测试普通require
const requireData = require('../../models/require');
// 测试require不存在文件
false && require('../../models/require2');

Page({
    data: {
        importData,
        importData2: `${importData} in any position`,

        exportNamedData: namedData,
        exportAllData: exportAllData.allData,

        minSuffixData,
        wxsData: wxsData.data,

        requireData: requireData.data,
        // 测试require任意位置
        requireData3: `${require('../../models/require').data} in any position`,

        loopImportData: `loop：${loopImportData}`,
        loopRequireData: `loop： ${loopRequireData.data}`,
    },
});

// 测试import任意位置
import importData2 from '../../models/import'; // eslint-disable-line