/***
 * 使用node 实现，使用es module实现，其中__dirname在es module里面不存在，需要通过fileURLToPath(import.meta.url)获取；
 * 从文件“Vue.js设计与实现.md”中读取所有图片信息，并下载到imgs目录下；
 * 
 */
// 引入所需的模块
import { fileURLToPath } from 'url';
import path from 'path';
import https from 'https';
import fs from 'fs';

// 转换模块URL到路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义Markdown文件路径和图片存储目录
const markdownFilePath = path.join(__dirname, 'Vue.js设计与实现.md');
const imgsDir = path.join(__dirname, 'imgs');

// 确保imgs目录存在
const ensureImgsDirExists = async () => {
  try {
    await fs.promises.access(imgsDir);
  } catch {
    await fs.promises.mkdir(imgsDir, { recursive: true });
  }
};

// 从Markdown文件中读取图片URL并下载
const downloadImages = async () => {
  await ensureImgsDirExists();

  // 读取Markdown文件内容
  const markdownContent = await fs.promises.readFile(markdownFilePath, 'utf8');

  // 使用正则表达式匹配图片URL
  const imageRegex = /!\[.*?\]\((.*?)\)/g;
  let match;
  while ((match = imageRegex.exec(markdownContent)) !== null) {
    const imageUrl = match[1];
    const imageFilename = path.basename(new URL(imageUrl).pathname);
    const imagePath = path.join(imgsDir, imageFilename);

    // 下载并保存图片
    return new Promise((resolve, reject) => {
      const fileStream = fs.createWriteStream(imagePath);
      https.get(imageUrl, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to get ${imageUrl} with status code ${response.statusCode}`));
          return;
        }
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          console.log(`Downloaded ${imageFilename}`);
          resolve();
        });
        fileStream.on('error', (err) => {
          console.error(`Error saving ${imageFilename}:`, err);
          reject(err);
        });
      }).on('error', (err) => {
        console.error(`Error downloading ${imageUrl}:`, err);
        reject(err);
      });
    });
  }
};

// 调用函数
downloadImages().catch(console.error);