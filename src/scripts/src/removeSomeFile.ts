import { normalize } from 'node:path'
import chalk from 'chalk'
import glob from 'fast-glob'
import fs from 'fs-extra'
import { askText } from './utils/question'

/**
 * 批量清理文件
 * @example: forZ rm 'F:\games\EternalRebirth v1.0.2.2'
 */

function multiRemoveFile(entryDir: string, userInput = '') {
  const files: string[] = glob.sync([userInput], { cwd: entryDir, dot: true })
  files.forEach((file) => {
    console.log(`删除文件：${file}`)
    fs.removeSync(file)
  })
}

async function loopForAsk(entryDir: string, userInput = '') {
  if (userInput) {
    // 如果有入参，直接处理
    multiRemoveFile(entryDir, userInput)
  } else {
    // 如果无入参，则不断询问，除非输入n则结束
    const res = await askText(`要删除的文件名：${chalk.green('(输入n回车可关闭)')}`)
    if (res.trim() === 'n') return
    multiRemoveFile(entryDir, res)
    await loopForAsk(entryDir, '')
  }
}

/**
 * 若由脚本启动，则直接运行
 */
(async () => {
  if (process.env.RUN_BY === 'scripts') {
    const args = process.argv.slice(2)
    const [entryDirByCli = ''] = args
    const dir = entryDirByCli || await askText('要清理的文件夹：')
    const entryDir = normalize(dir)
    loopForAsk(entryDir, '')
  }
})()
