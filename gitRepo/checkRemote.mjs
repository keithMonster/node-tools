/**
 * 
使用node(使用ES模块在.mjs文件中);
查询目录“/Users/xuke/DustessProject”下所有项目的git仓库地址，并且在当前目录输出到一个repos.json文件;
只查询/Users/xuke/DustessProject下第一级目录；
ES module中，__dirname 不能直接使用；
 */


import { promises as fsPromises } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';

const directoryPath = '/Users/xuke/DustessProject';
const repos = []; // 使用 const 定义 repos 因为它不需要在函数中被修改
// 解析当前模块的目录
const __dirname = new URL('.', import.meta.url).pathname;

const getGitRepos = async (dir) => {
  try {
    // 读取目录中的第一级目录项信息
    const files = await fsPromises.readdir(dir, { withFileTypes: true });

    for (const dirent of files) {
      if (dirent.isDirectory()) {
        const fullPath = join(dir, dirent.name);
        const gitDir = `${fullPath}/.git`; // 创建 .git 目录的路径

        // 检查 .git 目录是否存在
        if (await fsPromises.access(gitDir, fsPromises.constants.F_OK).then(() => true).catch(() => false)) {
          // 执行 git 命令获取仓库地址
          const { stdout } = await new Promise((resolve, reject) => {
            exec(`git -C "${fullPath}" remote get-url origin`, (error, stdout, stderr) => {
              if (error) {
                reject(error);
                return;
              }
              resolve({ stdout, stderr });
            });
          });

          // 确保 stdout 是 Buffer 类型，并转换为字符串
          const repoUrl = stdout.toString().trim();

          if (repoUrl) {
            repos.push({ path: fullPath, url: repoUrl }); // 将结果添加到 repos 数组
          }
        }
      }
    }

    // 写入 JSON 文件
    const outputFilePath = join(__dirname, 'repos.json'); // 输出到当前模块的目录
    await fsPromises.writeFile(outputFilePath, JSON.stringify(repos, null, 2));
    console.log('Repos saved to repos.json');
  } catch (err) {
    console.error('Error accessing directory:', err);
  }
};

getGitRepos(directoryPath).then(() => {
  // 完成后的操作
}).catch(console.error);