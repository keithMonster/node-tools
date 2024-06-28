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
import { params, jwt } from './apiTemplate.mjs';

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
// / 用于生成 .mjs 文件内容的函数
const generateMjsContent = (item) =>
  `
import { getJsonResult } from '../core.mjs';

getJsonResult(
  '${item['分类']}',
  '${item.eventName}',
  '${item.id}',
  fetch(
    'https://oss-bill-qa.dustess.net/bill-trail-settings-api/trail/event/${
      item.id
    }${jwt}',
     ${JSON.stringify(params)}
  )
);
`.trim();

// 将每个元素转换为 .mjs 文件内容并输出
result.forEach(async (item) => {
  const mjsFileContent = generateMjsContent(item) + '\n';
  const filename = item.eventName;
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
