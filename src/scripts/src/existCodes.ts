import { parse } from 'node:path'
import chalk from 'chalk'
import { getAllCodeFiles } from './utils/getAllCodeFiles'
import { askText } from './utils/question'

interface ExistCodeData {
  name: string
  filePath: string
}

/**
 * 查找相似的番号
 * @param userCode 用户输入的番号
 * @returns 相似的番号 [{ name, filePath }]
 */
function getExistCodesData(userCode: string) {
  // 待处理的番号
  const originCode = userCode.toLocaleUpperCase()

  const codeFiles = getAllCodeFiles()

  let existData = codeFiles.reduce((re, filePath) => {
    const { name } = parse(filePath)
    const isExist = originCode ? name.includes(originCode) : false
    if (!isExist) return re
    return re.concat({ name, filePath })
  }, [] as ExistCodeData[])
  existData = existData.sort((a, b) => a.name < b.name ? -1 : 1)

  return existData
}

// 打印找到的结果
function logData(existData: ExistCodeData[]) {
  if (existData.length < 1) {
    console.log(chalk.red('未找到'))
    return
  }
  existData.forEach(({ name, filePath }) => {
    console.log(chalk.green('找到'), name.padEnd(12, ' '), filePath)
  })
}

// 进行一波询问，限制次数
async function loopForAsk(userCode?: string) {
  if (userCode) {
    // 如果有入参，直接查找并打印
    const data = getExistCodesData(userCode)
    logData(data)
  } else {
    // 如果无入参，则不断询问，除非输入n则结束
    const res = await askText(`要查找的番号：${chalk.green('(输入n回车可关闭)')}`)
    if (res.trim() === 'n') return
    const data = getExistCodesData(res)
    logData(data)
    await loopForAsk()
  }
}

/**
 * 若由脚本启动，则直接运行
 */
(async () => {
  if (process.env.RUN_BY === 'scripts') {
    const args = process.argv.slice(2)
    const [codeByCli = ''] = args
    loopForAsk(codeByCli.trim())
  }
})()
