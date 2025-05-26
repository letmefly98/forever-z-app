import { readFileSync } from 'node:fs'
import { normalize, parse } from 'node:path'
import chalk from 'chalk'
import { badCodeDirs, codeDirs, waitCodeDirs } from '../config'
import { convertCodeName, getCodeName, removeCodeNamePart } from './utils/codeName'
import { getAllCodeFiles } from './utils/getAllCodeFiles'
import { askText } from './utils/question'

interface PickLinkData {
  code: string
  link: string
}

// 获取所有番号，转为对象方便比对是否已下载
const allFiles = getAllCodeFiles(codeDirs)
const badFiles = getAllCodeFiles(badCodeDirs) // 已下载的，但不好看的
const waitFiles = getAllCodeFiles(waitCodeDirs) // 下载过的，但有异常的
const codeMap = {} as { [code: string]: boolean | undefined }
const getCode = (file: string) => removeCodeNamePart(parse(file).name)
allFiles.forEach(file => codeMap[getCode(file)] = true)
badFiles.forEach(file => codeMap[getCode(file)] = false)
waitFiles.forEach(file => codeMap[getCode(file)] = undefined)

/**
 * 提取番号
 * @example: forZ pick 'G:\种子\冲田杏梨沖田杏梨観月あかねAnnri Okita.txt'
 */

// 提取番号，返回番号和链接
function getPickLinkData(entryFile: string) {
  // 读取内容
  const content = readFileSync(normalize(entryFile), 'utf-8')
  const lines = content.split(/\r?\n/)

  // 拆分每一行，提取标准化番号
  const result = lines.reduce((re, link) => {
    if (!link) return re
    let code = getCodeName(link)
    code = code ? convertCodeName(code) : ''
    return re.concat({ code, link })
  }, [] as PickLinkData[])

  return result
}

// 拆分番号，进行展示
function logPickLinkData(linkData: PickLinkData[]) {
  const errors: PickLinkData[] = [] // 番号错误的
  const include: PickLinkData[] = [] // 已下载的
  const bad: PickLinkData[] = [] // 不好看的
  const exclude: PickLinkData[] = [] // 未下载的

  // 进行分类
  linkData.forEach((data) => {
    const { code } = data
    if (!code) errors.push(data)
    else if (codeMap[code] === true) include.push(data)
    else if (codeMap[code] === false) bad.push(data)
    else exclude.push(data)
  })

  // 按顺序打印结果
  include.forEach(({ code, link }) => {
    console.log(chalk.green('已下载'), code.padEnd(12, ' '), link)
  })
  bad.forEach(({ code, link }) => {
    console.log(chalk.grey('不好看'), code.padEnd(12, ' '), link)
  })
  exclude.forEach(({ code, link }) => {
    console.log(chalk.yellow('未下载'), code.padEnd(12, ' '), link)
  })
  errors.forEach(({ code, link }) => {
    console.log(chalk.magenta('错误'), code.padEnd(12, ' '), link)
  })
}

/**
 * 若由脚本启动，则直接运行
 */
(async () => {
  if (process.env.RUN_BY === 'scripts') {
    const args = process.argv.slice(2)
    const [entryFileByCli = ''] = args
    const entryFile = entryFileByCli || await askText('要提取的文件：')
    const links = getPickLinkData(entryFile.trim())
    logPickLinkData(links)
  }
})()
