/***
 * 使用node(使用ES模块在.mjs文件中);获取"event模板信息.xlsx"表格的数据，然后存入一个array中。
 * __dirname在es module里面不存在，需要通过fileURLToPath(import.meta.url);获取
 */

// 导入xlsx库
import XLSX from 'xlsx';
import fs from 'fs/promises';
// 使用fileURLToPath和path模块来获取文件路径
import { fileURLToPath } from 'url';
import path from 'path';

// 将import.meta.url转换为文件路径
const __filename = fileURLToPath(import.meta.url);
// 获取当前文件所在的目录
const __dirname = path.dirname(__filename);

// 构建Excel文件的路径
const filePath = path.join(__dirname, 'event模板信息.xlsx');

// 使用readFile读取Excel文件
const workbook = XLSX.readFile(filePath);

// 选择工作簿中的第一个工作表
const firstSheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[firstSheetName];

// 将工作表数据转换为JSON数组
// 如果第一行是标题行，可以设置header: 1
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// 输出数据数组
// console.log(data);

/**
返回的数据中，第一个元素为表头，现在需要将表头作为key，一一对应到下面的数据，并且返回合并后的数据，比如：
[
{
表头:值
}
]
 */

// 获取表头行
const headers = data[0];

// 使用map函数遍历数据中的每一行（除了表头行），创建一个对象数组
const result = data.slice(1).map((row) => {
  const obj = {}; // 创建一个空对象
  row.forEach((cell, index) => {
    obj[headers[index]] = cell; // 将单元格值映射到相应的表头键下
  });
  return obj; // 返回创建的对象
});

// 输出结果
console.log(result);


// 现在有数组const result = [
//   {
//     _id: '95b8d8e6387f49d0ae1446a37181427e',
//     id: '95b8d8e6387f49d0ae1446a37181427e',
//     eventName: '联系人还原',
//     eventTopic: 'contactRestore',
//     remark: '联系人还原',
//     '分类': '修改记录',
//     '处理责任人': '@董超戈',
//     trailId: '1376762ce13e45eb90d4b8cf70a69bf9',
//     eventIcon: 'duero-icon-22999919-xiugai'
//   },
//   {
//     _id: '794c3978e1464d0dabd972710fca9e07',
//     id: '794c3978e1464d0dabd972710fca9e07',
//     eventName: '用户抽中奖品',
//     eventTopic: 'lotteryWinEvent',
//     remark: '用户抽中奖品事件',
//     '分类': '行为轨迹',
//     '处理责任人': '@董超戈',
//     trailId: '56d3c3371f0142859ca05b031c363bdc',
//     eventIcon: 'duero-icon-22999919-guiji'
// }]

// 循环数组，生成.mjs文件，其中{{ xx }}为模版插值，模版如下：
// `
// import { getJsonResult } from '../core.mjs';

// getJsonResult(
//   '{{ 分类 }}',
//   '{{ remark }}',
//   fetch(
//     'https://oss-bill-qa.dustess.net/bill-trail-settings-api/trail/event/{{ id }}?sessionId=JWT.eyJhbGciOiJSUzI1NiIsImtpZCI6ImR1Yy5vcGVuaWQuaWQtdG9rZW4iLCJ0eXAiOiJKV1QifQ.eyJhdF9oYXNoIjoic0xHckJld0QzNm8ybWN0UVNCUzkxUSIsImF1ZCI6WyJvc3NfYmlsbF9xYV8wMV9zcnYiXSwiYXV0aF90aW1lIjoxNzE5NDY5MzQyLCJlbWFpbCI6ImRvbmdjZ0BkdXN0ZXNzLmNvbSIsImV4cCI6MTcxOTUxMjU0MiwiaWF0IjoxNzE5NDY5MzQyLCJpc3MiOiJodHRwczovL2R1Yy5kdXN0ZXNzLmNvbS9hcGkvdjEvb2F1dGgyIiwianRpIjoiNzA4YTRhMzMtZDNkOC00ZTc5LWJjNTctMDU3ZDQzNmMyNDQwIiwibm9uY2UiOiIxMjM0NTY3OCIsInJhdCI6MTcxOTQ2OTM0Miwic3ViIjoiNTY0Iiwid2Vjb21fdWlkIjoiZG9uZ2NoYW9nZSJ9.OO98SqfCLy4nB8e1dL4Za9VWT0xdedpTQjb82QWSDlYA0QYWDSWMdNMav35iZu6J9SSmxnJNj6HFYI4oTdXQvQcuK-QYHSMk35rx25OKQUVya_qkbSLqYL2_OV0oIaT5Zgx_d8-A3eNXyR7OqxxiA5SQflvxpfoAIrRKXrSgYV4',
//     {
//       headers: {
//         accept: 'application/json, text/plain, */*',
//         'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
//         authorization:
//           'JWT.eyJhbGciOiJSUzI1NiIsImtpZCI6ImR1Yy5vcGVuaWQuaWQtdG9rZW4iLCJ0eXAiOiJKV1QifQ.eyJhdF9oYXNoIjoic0xHckJld0QzNm8ybWN0UVNCUzkxUSIsImF1ZCI6WyJvc3NfYmlsbF9xYV8wMV9zcnYiXSwiYXV0aF90aW1lIjoxNzE5NDY5MzQyLCJlbWFpbCI6ImRvbmdjZ0BkdXN0ZXNzLmNvbSIsImV4cCI6MTcxOTUxMjU0MiwiaWF0IjoxNzE5NDY5MzQyLCJpc3MiOiJodHRwczovL2R1Yy5kdXN0ZXNzLmNvbS9hcGkvdjEvb2F1dGgyIiwianRpIjoiNzA4YTRhMzMtZDNkOC00ZTc5LWJjNTctMDU3ZDQzNmMyNDQwIiwibm9uY2UiOiIxMjM0NTY3OCIsInJhdCI6MTcxOTQ2OTM0Miwic3ViIjoiNTY0Iiwid2Vjb21fdWlkIjoiZG9uZ2NoYW9nZSJ9.OO98SqfCLy4nB8e1dL4Za9VWT0xdedpTQjb82QWSDlYA0QYWDSWMdNMav35iZu6J9SSmxnJNj6HFYI4oTdXQvQcuK-QYHSMk35rx25OKQUVya_qkbSLqYL2_OV0oIaT5Zgx_d8-A3eNXyR7OqxxiA5SQflvxpfoAIrRKXrSgYV4',
//         'sec-ch-ua':
//           '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
//         'sec-ch-ua-mobile': '?0',
//         'sec-ch-ua-platform': '"macOS"',
//         'sec-fetch-dest': 'empty',
//         'sec-fetch-mode': 'cors',
//         'sec-fetch-site': 'same-origin',
//         cookie:
//           'sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%2218d77053ce3995-0530bde91a9e4e4-1e525637-1484784-18d77053ce4406%22%2C%22first_id%22%3A%22%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22%24device_id%22%3A%2218d77053ce3995-0530bde91a9e4e4-1e525637-1484784-18d77053ce4406%22%7D; dustess.aid=W00000000514',
//         Referer: 'https://oss-bill-qa.dustess.net/',
//         'Referrer-Policy': 'strict-origin-when-cross-origin',
//       },
//       body: null,
//       method: 'GET',
//     }
//   )
// );
// `
    
// / 用于生成 .mjs 文件内容的函数
const generateMjsContent = (item) => `
import { getJsonResult } from '../core.mjs';

getJsonResult(
  '${item['分类']}',
  '${item.remark}',
  fetch(
    'https://oss-bill-qa.dustess.net/bill-trail-settings-api/trail/event/${item.id}?sessionId=JWT.eyJhbGciOiJSUzI1NiIsImtpZCI6ImR1Yy5vcGVuaWQuaWQtdG9rZW4iLCJ0eXAiOiJKV1QifQ.eyJhdF9oYXNoIjoic0xHckJld0QzNm8ybWN0UVNCUzkxUSIsImF1ZCI6WyJvc3NfYmlsbF9xYV8wMV9zcnYiXSwiYXV0aF90aW1lIjoxNzE5NDY5MzQyLCJlbWFpbCI6ImRvbmdjZ0BkdXN0ZXNzLmNvbSIsImV4cCI6MTcxOTUxMjU0MiwiaWF0IjoxNzE5NDY5MzQyLCJpc3MiOiJodHRwczovL2R1Yy5kdXN0ZXNzLmNvbS9hcGkvdjEvb2F1dGgyIiwianRpIjoiNzA4YTRhMzMtZDNkOC00ZTc5LWJjNTctMDU3ZDQzNmMyNDQwIiwibm9uY2UiOiIxMjM0NTY3OCIsInJhdCI6MTcxOTQ2OTM0Miwic3ViIjoiNTY0Iiwid2Vjb21fdWlkIjoiZG9uZ2NoYW9nZSJ9.OO98SqfCLy4nB8e1dL4Za9VWT0xdedpTQjb82QWSDlYA0QYWDSWMdNMav35iZu6J9SSmxnJNj6HFYI4oTdXQvQcuK-QYHSMk35rx25OKQUVya_qkbSLqYL2_OV0oIaT5Zgx_d8-A3eNXyR7OqxxiA5SQflvxpfoAIrRKXrSgYV4',
     {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
        authorization:
          'JWT.eyJhbGciOiJSUzI1NiIsImtpZCI6ImR1Yy5vcGVuaWQuaWQtdG9rZW4iLCJ0eXAiOiJKV1QifQ.eyJhdF9oYXNoIjoic0xHckJld0QzNm8ybWN0UVNCUzkxUSIsImF1ZCI6WyJvc3NfYmlsbF9xYV8wMV9zcnYiXSwiYXV0aF90aW1lIjoxNzE5NDY5MzQyLCJlbWFpbCI6ImRvbmdjZ0BkdXN0ZXNzLmNvbSIsImV4cCI6MTcxOTUxMjU0MiwiaWF0IjoxNzE5NDY5MzQyLCJpc3MiOiJodHRwczovL2R1Yy5kdXN0ZXNzLmNvbS9hcGkvdjEvb2F1dGgyIiwianRpIjoiNzA4YTRhMzMtZDNkOC00ZTc5LWJjNTctMDU3ZDQzNmMyNDQwIiwibm9uY2UiOiIxMjM0NTY3OCIsInJhdCI6MTcxOTQ2OTM0Miwic3ViIjoiNTY0Iiwid2Vjb21fdWlkIjoiZG9uZ2NoYW9nZSJ9.OO98SqfCLy4nB8e1dL4Za9VWT0xdedpTQjb82QWSDlYA0QYWDSWMdNMav35iZu6J9SSmxnJNj6HFYI4oTdXQvQcuK-QYHSMk35rx25OKQUVya_qkbSLqYL2_OV0oIaT5Zgx_d8-A3eNXyR7OqxxiA5SQflvxpfoAIrRKXrSgYV4',
        'sec-ch-ua':
          '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        cookie:
          'sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%2218d77053ce3995-0530bde91a9e4e4-1e525637-1484784-18d77053ce4406%22%2C%22first_id%22%3A%22%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22%24device_id%22%3A%2218d77053ce3995-0530bde91a9e4e4-1e525637-1484784-18d77053ce4406%22%7D; dustess.aid=W00000000514',
        Referer: 'https://oss-bill-qa.dustess.net/',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      body: null,
      method: 'GET',
    }
  )
);
`.trim();

// 将每个元素转换为 .mjs 文件内容并输出
result.forEach(async (item) => {
  const mjsFileContent = generateMjsContent(item) + '\n';
  const filename = item.remark;
  try {
    // 调用fs/promises的writeFile方法，返回一个Promise
    const dirPath = path.join(__dirname, 'output'); // 假设'output'是相对于当前文件的目录
    const filePath = path.join(dirPath, `${filename}.mjs`); // 文件路径

    await fs.writeFile(filePath, mjsFileContent);
    console.log(`文件 ${filename} 写入成功。`);
  } catch (err) {
    // 错误处理
    console.error('写入文件时发生错误:', err);
  }
});
