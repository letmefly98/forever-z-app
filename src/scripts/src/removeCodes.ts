import type { Choice } from './utils/question'
import { writeFileSync } from 'node:fs'
import { join, parse } from 'node:path'
import chalk from 'chalk'
import trash from 'trash'
import { badCodeDirs, codeDirs, waitCodeDirs } from '../config'
import { convertCodeName } from './utils/codeName'
import { getAllCodeFiles } from './utils/getAllCodeFiles'
import { askChoice, askText } from './utils/question'

type GetRemoveCodesData = (needRemoveCode: string) => { remove: string[], cached: string[], toCache: string }
const getRemoveCodesData: GetRemoveCodesData = (needRemoveCode) => {
  // 待处理的番号
  const originCode = needRemoveCode.toLocaleUpperCase()

  // 获取所有番号文件
  const codeFiles = getAllCodeFiles(codeDirs.concat(waitCodeDirs))
  const badFiles = getAllCodeFiles(badCodeDirs)

  // 找出相同的番号，以及可删除的番号
  const remove = codeFiles.filter(file => isSimilarCode(file, originCode))
  const cached = badFiles.filter(file => isSameCode(file, originCode))
  const toCache = join(badCodeDirs[0], `${convertCodeName(originCode)}.txt`)

  return { remove, cached, toCache }
}
export default getRemoveCodesData

// 相似的番号，比如 newCode 为 'SNIS-43'，则能找到多个相似番号
function isSimilarCode(myFile: string, newCode: string) {
  const myCode = parse(myFile).name
  return myCode.includes(newCode)
}

// 完全相同的番号
function isSameCode(myFile: string, newCode: string) {
  const myCode = parse(myFile).name
  return myCode === newCode
}

// 循环询问是否删除
async function handleShouldRemove(shouldRemoveData: ReturnType<GetRemoveCodesData>, excludes: string[] = []) {
  const { remove, cached, toCache } = shouldRemoveData

  const files = [...remove, ...cached].filter(file => file !== toCache) // 可以删除的文件
  const toCache2 = !excludes.includes(toCache) && !cached.includes(toCache) ? [toCache] : [] // 可以新增的文件

  // 可以删除的去掉已经操作过的文件
  const remove2 = files.filter(file => !excludes.includes(file))

  // 若该番号已被删除，提前提示
  if (cached.includes(toCache)) {
    if (excludes.length < 1) { // 只提示一次
      console.log('该番号已加入“下载过”')
    }
  }

  // 若没有可操作的文件，直接退出
  if (remove2.length < 1 && toCache2.length < 1) return

  // 拼凑选项，进行询问
  const choices: Choice[] = [
    ...remove2.map(file => ({ name: `${chalk.red('删除')}: ${file}`, value: file })),
    ...toCache2.map(file => ({ name: `${chalk.green('新增')}: ${file}`, value: file })),
    { name: '退出', value: 'exit' },
  ]
  const res = await askChoice('要处理的番号：', choices)

  // 根据询问结果操作文件
  if (res === 'exit') return
  if (res === toCache) {
    writeFileSync(toCache, '', 'utf8')
    console.log(`新增成功：${res}`)
  } else {
    trash(res)
    console.log(`删除成功：${res}`)
  }

  // 递归处理，直到没有可处理的文件
  handleShouldRemove(shouldRemoveData, [...excludes, res])
}

/**
 * 若由脚本启动，则直接运行
 */
(async () => {
  if (process.env.RUN_BY === 'scripts') {
    const args = process.argv.slice(2)
    const [codeByCli] = args
    const code = codeByCli || await askText('要删除的番号：')
    const shouldRemoveData = getRemoveCodesData(code)
    handleShouldRemove(shouldRemoveData)
  }
})()
