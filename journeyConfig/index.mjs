/***
 * 使用node(es module)，获取"event模板信息.xlsx"表格的数据，然后存入一个array中。
 * __dirname在es module里面不存在，需要通过fileURLToPath(import.meta.url);获取
 */

// 导入xlsx库
import XLSX from 'xlsx';

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
