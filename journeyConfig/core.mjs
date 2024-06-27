import fs from 'fs/promises';
// 使用fileURLToPath和path模块来获取文件路径
import { fileURLToPath } from 'url';
import path from 'path';

import { icons } from './config.mjs';
import { isChinese, removeQuotes } from './utils.mjs';

// 将import.meta.url转换为文件路径
const __filename = fileURLToPath(import.meta.url);
// 获取当前文件所在的目录
const __dirname = path.dirname(__filename);

async function writeJson(filename, content) {
  try {
    // 调用fs/promises的writeFile方法，返回一个Promise
    const dirPath = path.join(__dirname, 'jsons'); // 假设'output'是相对于当前文件的目录
    const filePath = path.join(dirPath, `${filename}.json`); // 文件路径

    await fs.writeFile(filePath, JSON.stringify(content, null, '  '));
    console.log(`文件 ${filename} 写入成功。`);
  } catch (err) {
    // 错误处理
    console.error('写入文件时发生错误:', err);
  }
}

// 现在有三目运算的表达式："msgNum != nil && msgNum != '' ? '共' + msgNum + '条消息' : nil"
// 我需要提取？后面的的'共' 、 msgNum 、 '条消息'这三个元素，编号为1,2,3；
// 这三个元素不一定都有；
// 其中，元素1代表这段字符串的前缀，元素2代表这段字符串的中间值，元素3代表后缀；
// 需要输出一个对象；
// 内容为：
// 如果有元素1，则新增：{ default: 元素 }
// 如果有元素2，且不是中文则新增：{ field: 元素 }
// 如果有元素3，则新增：{ suffix: 元素 }
// 比如上面那个表达式需要返回: { default: '共' , field: 'msgNum', suffix:'条消息'}

function expressTransform(express) {

  function extractTernaryElements(expression) {
    // 正则表达式匹配三目运算符的 true 部分
    const truePartRegex = /(?<=\?)\s*(.*?)(?=:\s*nil)/;
    const match = truePartRegex.exec(expression);

    if (!match) {
      return {};
    }

    const truePart = match[0].trim();
    const elements = truePart.split(/\s*\+\s*/); // 分割元素

    const result = {};

    // 遍历元素数组，提取元素
    elements.forEach((element, index) => {
      if (index === 0 && isChinese(element)) {
        // 元素1，中文前缀
        result.default = removeQuotes(element);
      } else if (index === 1 && !isChinese(element)) {
        // 元素2，中间值
        result.field = element;
      } else if (index === 2 && isChinese(element)) {
        // 元素3，中文后缀
        result.suffix = removeQuotes(element);
      }
    });

    // 清理结果对象，只保留存在的键
    return Object.keys(result).reduce((obj, key) => {
      if (result[key]) {
        obj[key] = result[key];
      }
      return obj;
    }, {});
  }

  return extractTernaryElements(express);
}

function fieldTransform(title, item) {
  if (isChinese(item.express)) {
    return title.push({
      field: 'default',
      default: removeQuotes(item.express),
    });
  }
//   console.log('express2', );
return title.push(expressTransform(item.express))
}

function getJson(type, oldTitle, oldContent) {
  const card = {
    type: 'event',
    time: 'time',
    icon: icons[type].icon,
    iconColor: icons[type].color,
  };

  const title = [];
  const content = [];

  console.log('oldTitle:', oldTitle);

  oldTitle.map((item) => {
    fieldTransform(title, item);
  });

  console.log('title:', title);

  console.log('oldContent:', oldContent);

  oldContent?.map((item) => {
    fieldTransform(content, item);
  });

  console.log('content:', content);

  return {
    card,
    title,
    content,
  };
}

export function getJsonResult(type, name, fetchApi) {
  fetchApi
    .then((response) => {
      // 首先检查响应是否成功
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // 解析JSON数据
      return response.json();
    })
    .then((data) => {
      // 处理获取的数据
      const records = data.data.templates[0].records;
      const title = JSON.parse(records[0].item);
      const content = JSON.parse(records[1]?.item || null);
        // console.log('old_template:', records);
      const result = getJson(type, title, content);
      //   writeJson(name, result);
    });
}
