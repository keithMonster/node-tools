// 使用node开发，源代码在目录：Dus/_tool/check.mjs，需要写一个方法来获取package.json的信息，然后输出到一个excel文件。
// 1. 获取Dus目录下所有文件夹projectList，一个文件夹代表一个项目，然后过滤掉_tool
// 2. 循环projectList,获取项目文件下的package.json文件的内容
// 3. 输出的文件有3个字段，第一个是项目名称，
// 4. 第二个是从package.json里面获取是否有名叫@dustess/icloud-upload的依赖，如果有就作为第二个字段的值，没有就为空
// 5. 第三个字段是package.json里面@dustess/icloud-upload的依赖版本号，没有就为空
// 6. 然后再加一个限制，如果第二个字段为“否”则在excel文档里面去掉这一行
// 7. 在这个数组下面查找
// qw-login
// qw-mobile-mine
// qw-mobile-workbench
// qw-mobile-todo
// qw-mobile
// qw-mobile-docking-center-web
// app-bigdata-mobile-web
// qw-mobile-op-authorization
// qw-mobile-op-tool
// qw-manage-help-center-client
// cfx-lego-web
// iform
// scrm-manage-short-message-web
// scrm-manage-cashier-web
// app-bigdata-web
// app-bigdata-mobile-web
// scrm-manage-extra
// scrm-manage-main
// scrm-manage-workbench
// scrm-manage-docking-center-web
// scrm-manage-app-center-web
// qw-client-platform-notification
// qw-manage-industrial-client
// cf-enterprise-official-website
// enterprise-official-website-bd
// bigdata-bi-platform-client
// app-center-manage
// wp-bill-client
// openplatform-mng
// qw-operation-channel-client
// op-mobile-woa-web
// cfx-config-platform

import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import ExcelJS from "exceljs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_PATH = '/Users/xuke/DustessProject'

// const projectList = fs
//   .readdirSync(ROOT_PATH, { withFileTypes: true })
//   .filter((dirent) => dirent.isDirectory() && dirent.name !== "_tool")
//   .map((dirent) => dirent.name);

const projectList = [
  "qw-login",
  "qw-mobile-mine",
  "qw-mobile-workbench",
  "qw-mobile-todo",
  "qw-mobile",
  "qw-mobile-docking-center-web",
  "app-bigdata-mobile-web",
  "qw-mobile-op-authorization",
  "qw-mobile-op-tool",
  "qw-manage-help-center-client",
  "cfx-lego-web",
  "iform",
  "scrm-manage-short-message-web",
  "scrm-manage-cashier-web",
  "app-bigdata-web",
  "app-bigdata-mobile-web",
  "scrm-manage-extra",
  "scrm-manage-main",
  "scrm-manage-workbench",
  "scrm-manage-docking-center-web",
  "scrm-manage-app-center-web",
  "qw-client-platform-notification",
  "qw-manage-industrial-client",
  "cf-enterprise-official-website",
  "enterprise-official-website-bd",
  "bigdata-bi-platform-client",
  "app-center-manage",
  "wp-bill-client",
  "openplatform-mng",
  "qw-operation-channel-client",
  "op-mobile-woa-web",
  "cfx-config-platform",
];

const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet("Project Information");
worksheet.columns = [
  { header: "项目名称", key: "projectName" },
  { header: "是否有@dustess/icloud-upload依赖", key: "hasIcloudUpload" },
  { header: "@dustess/icloud-upload版本号", key: "icloudUploadVersion" },
];

projectList.forEach((projectName) => {
  const packageJsonPath = `${ROOT_PATH}/${projectName}/package.json`;
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      const hasIcloudUpload =
        packageJson.dependencies &&
        packageJson.dependencies["@dustess/icloud-upload"];
      const icloudUploadVersion = hasIcloudUpload
        ? packageJson.dependencies["@dustess/icloud-upload"]
        : "";

      if (hasIcloudUpload) {
        worksheet.addRow({
          projectName,
          hasIcloudUpload: "是",
          icloudUploadVersion,
        });
      }
    } catch (err) {
      console.error(`解析 ${packageJsonPath} 时出错：`, err);
    }
  } else {
    console.log(`${packageJsonPath},没找到`);
  }
});

workbook.xlsx
  .writeFile("project_info.xlsx")
  .then(() => {
    console.log("Excel 文件已生成。");
  })
  .catch((err) => {
    console.error("生成 Excel 文件时出错：", err);
  });
