import { execSync } from 'node:child_process'
import path from 'node:path'
import chalk from 'chalk'
import glob from 'fast-glob'
import fs from 'fs-extra'
import trash from 'trash'

/**
 * 批量解压带密码的 zip 文件
 */

const exeFilePath = path.resolve('D:\\7-Zip')
const resultDir = path.resolve('F:\\HHH\\图片\\AI')
const zipDir = path.resolve('C:\\Users\\Admin\\Documents\\Tencent Files\\617754841\\FileRecv')

// 找到所有的 .zip 或 .zip删除 文件
const zipFiles = glob.sync('*.zip(删除)?', { cwd: zipDir, absolute: true })

// 遍历
for (const originZipFile of zipFiles) {
  // 若为 .zip删除 文件，复制为 .zip 文件
  let zipFile = originZipFile
  if (originZipFile.endsWith('删除')) {
    zipFile = originZipFile.slice(0, -2)
    fs.copySync(originZipFile, zipFile)
  }

  // 确定解压后的目录位置
  const zipName = path.parse(zipFile).name
  const outputDir = path.join(resultDir, zipName)

  // 开始解压
  if (!fs.existsSync(outputDir)) {
    console.log('解压', zipFile, '至', outputDir)
    await unzipDir(zipFile, outputDir, '123')
  } else {
    console.log('解压', zipFile, chalk.red('存在同名目录'), outputDir)
  }

  // 打开解压后的目录
  // openDir(outputDir)

  // 删除已使用的 .zip 文件
  await trash(originZipFile)
  if (originZipFile.endsWith('删除')) {
    await trash(zipFile)
  }
}

// 带密码的解压 .zip 文件
function unzipDir(zipFile: string, targetDir: string, password = '') {
  const command = `7z x "${zipFile}" -o"${targetDir}" -p"${password}" -aoa`
  execSync(command, { input: exeFilePath })
}

// 打开目录
// function openDir(dir: string) {
//   const command = `start "" "${dir}"`
//   execSync(command)
// }
