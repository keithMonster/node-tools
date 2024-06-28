export function removeQuotes(str) {
  // 正则表达式匹配所有单引号和双引号
  const quotesRegex = /["']/g;
  // 使用 replace 方法替换掉所有匹配的引号
  return str.replace(quotesRegex, '');
}

export function isChinese(str) {
  // 正则表达式匹配所有非文本字符
  const chineseRegex = /^[\u4e00-\u9fff]+$/;
  return chineseRegex.test(removeQuotes(str));
}

export function isValidVariableName(str) {
  const variableNameRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
  return variableNameRegex.test(str);
}
