import { renameSync } from 'node:fs'
import { format, normalize, parse } from 'node:path'
import chalk from 'chalk'
import { convertCodeName, isContinuousCodes, removeCodeNamePart } from './utils/codeName'
import { getDeepFiles } from './utils/findDeep'
import { askText } from './utils/question'

/**
 * 将单个文件夹里的所有番号名规范化
 * @example 比如将 'snisadd432un' 转为 'SNIS-432'
 * @param dir 要处理的文件夹
 * @returns 番号数据 { pass: [file, code], change: [file, code], fail: [file, code, conflict] }
 */
export function getRenameCodesData(dir: string) {
  const files = getDeepFiles(dir)

  const pass: [string, string][] = [] // 无变化的番号
  const change: [string, string][] = [] // 正常转换的番号
  const fail: [string, string, string[]][] = [] // 有问题的番号（重复等）

  // 获取文件的名称
  const fileNames = files.map(file => parse(file).name)
  // 获取规范化后的番号
  const codes = fileNames.map(name => convertCodeName(name))
  // 番号去除结尾，方便查重
  const pureCodes = codes.map(code => removeCodeNamePart(code))

  // 转为 { [pureCode]: [[code, file]] } 格式，方便查重
  const uniqueMap = codes.reduce((re, code, index) => {
    const file = files[index]
    const pureCode = pureCodes[index]
    if (!re[pureCode]) re[pureCode] = []
    re[pureCode].push([code, file])
    return re
  }, {})

  // 开始判断需重命名的番号
  codes.forEach((code, index) => {
    const name = fileNames[index]
    const file = files[index]
    const pureCode = pureCodes[index]
    const similarItems = uniqueMap[pureCode]

    // 部分番号规范化后有字母 C 结尾，若仅单个文件如此，则应去除 C 结尾
    if (/\dc$/i.test(code)) {
      if (similarItems.length <= 1) {
        change.push([file, pureCode])
        return
      }
    }

    // 番号处理完成后，若存在番号重复且不为连续关系，则应告警
    // TODO: 可能存在已存在 A B 结尾但又下载了个 C 结尾，造成未剔除的情况
    if (similarItems.length > 1) {
      const similarCodes: string[] = similarItems.map(([c, _file]) => c)
      if (!isContinuousCodes(similarCodes)) {
        const exist = fail.find(([_file, c, _matcher]) => c === pureCode)
        if (!exist) {
          const matcher = similarItems.filter(([c, _file]) => c !== code).map(([_c, file]) => file)
          fail.push([file, pureCode, matcher])
          return
        }
      }
    }

    // 番号相同则跳过
    if (code === name) {
      pass.push([file, code])
      return
    }

    // 剩下的则是需按规范化进行重命名的
    change.push([file, code])
  })

  return { pass, change, fail }
}
export default getRenameCodesData

/**
 * 将该文件以规范化番号重命名
 * @param file 文件路径
 * @param code 番号
 */
export function renameFileByNewCode(file: string, code: string): void {
  const { dir, ext } = parse(file)
  const target = format({ dir, name: code, ext })
  renameSync(file, target)
}

/**
 * 若由脚本启动，则直接运行
 */
(async () => {
  if (process.env.RUN_BY === 'scripts') {
    const args = process.argv.slice(2)
    const [dirByCli] = args
    const dir = dirByCli ? normalize(dirByCli) : await askText('进行重命名的文件夹：')
    const { pass, change, fail } = getRenameCodesData(dir)
    // 最终处理，打印结果 & 重命名文件
    pass.forEach(([file, code]) => {
      console.log(chalk.green('不变'), code.padEnd(12, ' '), chalk.gray(file))
    })
    change.forEach(([file, code]) => {
      console.log(chalk.yellow('改变'), code.padEnd(12, ' '), chalk.gray(file))
      renameFileByNewCode(file, code)
    })
    fail.forEach(([file, code, matcher]) => {
      console.log(chalk.red('错误'), code.padEnd(12, ' '), chalk.gray(file), chalk.gray(matcher.join(' ')))
    })
  }
})()
