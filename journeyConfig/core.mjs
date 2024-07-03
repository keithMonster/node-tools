import fs from 'fs/promises';
// 使用fileURLToPath和path模块来获取文件路径
import { fileURLToPath } from 'url';
import path from 'path';

import { icons } from './config.mjs';
import { isChinese, removeQuotes, isValidVariableName } from './utils.mjs';
import { params, jwt, putHeaders } from './apiTemplate.mjs';

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
    // console.log(`文件 ${filename} 写入成功。`);
  } catch (err) {
    // 错误处理
    console.error('写入文件时发生错误:', err);
  }
}

function fixedExpress(express) {
  if (
    express ===
    "operator != nil && operator != '' && operator != 'sys' ? operator : '系统'"
  ) {
    return {
      field: 'translationFun.cusUpdatedOperatorName',
      comType: 'TEXT',
      color: '#0D6BE9',
    };
  }
  return false;
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
    const truePartRegex = /(?<=\?)([^:]*)/;
    const match = truePartRegex.exec(expression);

    if (!match) {
      return {};
    }

    const truePart = match[0].trim();
    const elements = truePart.split(/\s*\+\s*/); // 分割元素

    const result = {};
    // console.log('elements:', elements);

    // 遍历元素数组，提取元素
    elements.forEach((element, index) => {
      if (index === 0) {
        if (element === "'ㅤ'") {
          // 空格不管
          return false;
        }

        if (!isValidVariableName(element)) {
          // 元素1，中文前缀
          result.default = removeQuotes(element);
          result.field = 'default';
          return;
        }

        result.field = element;
        result.comType = 'TEXT';
      }
      if (index === 1 && isValidVariableName(element)) {
        // 元素2，中间值
        result.field = element;
        result.comType = 'TEXT';
        return;
      }
      if (index === 2 && !isValidVariableName(element)) {
        // 元素3，中文后缀
        result.suffix = removeQuotes(element);
        return;
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

// 现在有表达式是这种形式比如：
// '参与“'+activityName+'”活动获得:'+ ''；
// '“'+prizeName+'”'；
// 均是字符串/变量名的组合，现在需要你匹配这类表达式，并且根据+分隔后提取为数组
// 提取结果过滤掉只有引号的值；
// 过滤的引号包括这些形式：'“'、'”'，包括中英文的单引号、双引号；
// 并且在输出的字符串里面也需要过滤这些引号；
// 再过滤掉空值

function strConcatTransform(express) {
  function extractAndCleanParts(expression) {
    // 正则表达式匹配由 + 连接的字符串和变量
    const regex = /(\b\w+\b)|("[^"]*"|'[^']*')/g;
    let match;
    const parts = [];

    // 使用循环持续寻找匹配的部分
    while ((match = regex.exec(expression)) !== null) {
      // 去除字符串引号
      const cleanPart = match[0].replace(/^["']|["']$/g, '');
      // 过滤掉空字符串和只包含空白字符的字符串
      if (cleanPart.trim() !== '') {
        parts.push(cleanPart);
      }
    }

    return parts;
  }
  if (express?.includes('?')) {
    return false;
  }
  const matchArr = extractAndCleanParts(express);
  // console.log('----:', matchArr);
  const result = {};
  matchArr.map((item, index) => {
    if (isValidVariableName(item)) {
      result.field = item;
      result.comType = 'TEXT';
    } else {
      if (index === 0) {
        result.default = removeQuotes(item);
        result.field = 'default';
      } else {
        result.suffix = removeQuotes(item);
      }
    }
  });
  return result;
}

function fieldTransform(resField, item) {
  const express = item.express;
  if (isChinese(express)) {
    return resField.push({
      field: 'default',
      default: removeQuotes(express),
    });
  }
  //   特殊表达式
  const fixedField = fixedExpress(express);
  if (fixedField) {
    return resField.push(fixedField);
  }

  //   三目运算
  const matchField = expressTransform(express);
  if (Object.keys(matchField)?.length) {
    return resField.push(matchField);
  }
  //   字符串拼接
  const strMached = strConcatTransform(express);
  //   console.log('strMached:', strMached);
  if (strMached) {
    // console.log();
    return resField.push(strMached);
  }

  //   console.log('filter-express-------', express);
}

function filterNewAttrFields(list, newAttrFields) {
  // 一些在newAttr下面的字段
  list.forEach((item) => {
    if (newAttrFields.includes(item.field)) {
      item.field = `newAttr.${item.field}`;
    }
  });
}

function filterTranslationFields(list) {
  // 一些需要后端映射的字段
  const translationFunFields = {
    customerId: 'newAttr.viewCustomerId',
  };
  list.forEach((item) => {
    if (item.field in translationFunFields) {
      item.field = translationFunFields[item.field];
    }
  });
}

function getJson(type, oldTitle, oldContent, newAttrFields) {
  const card = {
    type: 'event',
    time: 'time',
    icon: icons[type].icon,
    iconColor: icons[type].color,
  };

  const title = [];
  const content = [];

  // console.log('oldTitle:', oldTitle);

  oldTitle.map((item) => {
    fieldTransform(title, item);
  });

  // console.log('oldContent:', oldContent);

  oldContent?.map((item) => {
    fieldTransform(content, item);
  });

  [title,content].forEach(listItem => {
    filterNewAttrFields(listItem, newAttrFields);
    filterTranslationFields(listItem);
  })

  // console.log('title:', title);
  // console.log('content:', content);

  return {
    card,
    title: [title],
    content,
  };
}

export function getJsonResult(type, name, id, fetchApi) {
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
      const resData = data.data;
      // 处理获取的数据
      const records = resData.templates[0].records;
      const title = JSON.parse(records[0].item);
      const content = JSON.parse(records[1]?.item || null);
      // console.log('old_template:', records);
      //   console.log('resData:', resData);
      const newAttrFields = resData.fieldList
        .filter((field) => !field.defaultField)
        .map((field) => field.fieldName);
      //   console.log('newAttrFields:', newAttrFields);
      const result = getJson(type, title, content, newAttrFields);
      //   defaultField
      writeJson(name, result);
      resData.rule = {
        rule: JSON.stringify(result),
      };
      //   console.log('reqData.id:', reqData.id);
      fetch(
        'https://oss-bill-qa.dustess.net/bill-trail-settings-api/trail/event' +
          jwt,
        {
          headers: putHeaders,
          body: JSON.stringify(resData),
          method: 'PUT',
        }
      )
        .then((response) => {
          // 首先检查响应是否成功
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          // 解析JSON数据
          return response.json();
        })
        .then((data) => {
          console.log(`${name}:res`, data);
        });
    });
}
