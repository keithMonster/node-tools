// 执行output目录下所有文件

// 确保文件扩展名为 .mjs 来使用 ES 模块

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// 异步函数来执行所有 .mjs 文件
async function executeMjsFilesInDirectory(directory) {
  try {
    // 读取目录内容
    let files = await fs.readdir(directory, { withFileTypes: true });

    // 过滤出 .mjs 文件并映射到它们的路径
    const mjsFiles = files
      .filter(dirent => dirent.name.endsWith('.mjs'))
      .map(dirent => path.join(directory, dirent.name));

    // 执行每个 .mjs 文件
    for (const file of mjsFiles) {
      try {
        console.log(`Executing file: ${file}`);
        const module = await import(path.resolve(file));
        if (module.default) {
          // 如果模块有默认导出，执行它
          await module.default();
        } else {
          console.log(`Module ${file} does not have a default export to execute.`);
        }
      } catch (error) {
        console.error(`Error executing file ${file}:`, error);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error);
  }
}

// 将import.meta.url转换为文件路径
const __filename = fileURLToPath(import.meta.url);
// 获取当前文件所在的目录
const __dirname = path.dirname(__filename);

// 要执行的目录路径
const directoryPath = path.join(__dirname, 'output');

// 调用函数执行目录下的所有 .mjs 文件
executeMjsFilesInDirectory(directoryPath);