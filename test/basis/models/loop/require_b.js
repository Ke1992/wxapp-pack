// 引用
const requireAData = require('./require_a');

// 输出
exports.data = `require_b data, ${requireAData.data}`;
