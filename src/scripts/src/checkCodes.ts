import type { ParsedPath } from 'node:path'
import { parse } from 'node:path'
import chalk from 'chalk'
import { groupBy, omitBy, pickBy } from 'lodash-es'
import { convertCodeName, isContinuousCodes, removeCodeNamePart } from './utils/codeName'
import { getAllCodeFiles } from './utils/getAllCodeFiles'

type Conflict = [string, string[]] // [code, [file]]
type CodeData = [string, ParsedPath, string, string] // [file, data, code, pureCode]

/**
 * 检查所有番号文件，看是否存在异常
 * @returns 检查结果 [[pureCode, [files]]]
 */
export function getConflictCodesData() {
  const conflicts: Conflict[] = []

  // 获取所有番号文件
  const files = getAllCodeFiles()

  // 转化整合数据，方便后续进行处理
  const filesData: CodeData[] = files.map((file) => {
    const data = parse(file)
    const code = convertCodeName(data.name)
    const pureCode = removeCodeNamePart(code)
    return [file, data, code, pureCode]
  })
  const pureCodeMap = groupBy(filesData, (d: CodeData) => d[3])

  // 判断重复名称相关的冲突
  const multiPureCode = pickBy(pureCodeMap, (matcher: CodeData[]) => matcher.length > 1)
  Object.keys(multiPureCode).forEach((pureCode) => {
    const matcher: CodeData[] = multiPureCode[pureCode]
    const isConflict = isConflictInRepeatCode(matcher)

    if (!isConflict) return

    const files = matcher.map(m => m[0])
    conflicts.push([pureCode, files])
  })

  // 其他名称不重复的冲突
  const singlePureCode = omitBy(pureCodeMap, Object.keys(multiPureCode))
  Object.keys(singlePureCode).forEach((pureCode) => {
    const matcher: CodeData[] = singlePureCode[pureCode]
    const isConflict = isConflictInSingleCode(matcher)

    if (!isConflict) return

    const [file] = matcher[0]
    conflicts.push([pureCode, [file]])
  })

  return conflicts
}

/**
 * 判断重复名称相关的冲突
 * @example 冲突1：名称相同，但处于不同文件夹，包括正确连续
 * @example 冲突2：名称相同，但没有正确连续
 * @example 冲突3：名称相同，但后缀不同，但若正确连续也正确（被冲突2包含）
 * @param matcher 名称相同的数据
 * @returns 存在冲突
 */
function isConflictInRepeatCode(matcher: CodeData[]) {
  const [, { dir }] = matcher[0]
  const isDifferentDir = matcher.some(([, { dir: d }]) => d !== dir)
  const isContinuous = isContinuousCodes(matcher.map(m => m[2]))
  if (isDifferentDir) return true
  if (!isContinuous) return true
  return false
}

/**
 * 判断单个名称相关的冲突
 * @example 冲突1：番号不正确，或番号正确但带有其他内容
 * @param matcher 单个名称的数据
 * @returns 存在冲突
 */
function isConflictInSingleCode(matcher: CodeData[]) {
  const [, data, code] = matcher[0]
  if (data.name !== code) return true
  return false
}

/**
 * 若由脚本启动，则直接运行
 */
(async () => {
  if (process.env.RUN_BY === 'scripts') {
    const codes = getConflictCodesData()
    codes.forEach(([pureCode, files]) => {
      console.group(chalk.red(pureCode))
      console.log(files.join('\n'))
      console.groupEnd()
    })
  }
})()
