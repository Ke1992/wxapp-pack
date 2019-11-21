// 测试import的dir、./dir、../dir、/dir场景
import { importData } from 'common/import';
import { importData2 } from './common/import';
import { importData3 } from '../../models/sub_a_import';
import { importData4 } from '/common/import';
// 测试require的dir、./dir、../dir、/dir场景
const { requireData } = require('common/require');
const { requireData2 } = require('./common/require');
const { requireData3 } = require('../../models/sub_a_require');
const { requireData4 } = require('/common/require');

Page({
    data: {
        importData,
        importData2,
        importData3,
        importData4,

        requireData,
        requireData2,
        requireData3,
        requireData4,
    },
});
