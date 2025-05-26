import { readdirSync, statSync } from 'node:fs'
import { join, normalize } from 'node:path'
import { ignorePaths } from '../../config'

type FileCallback = (uri: string) => void
type DirCallback = (uri: string) => boolean | any

/**
 * 遍历文件夹中所有文件（包括子文件夹）
 * @param {string} dir 文件夹地址
 * @param fileCallback 遇到文件时的回调
 * @param dirCallback 遇到子文件夹时的回调（可返回 false 跳过此文件夹）
 */
export function findDeep(dir: string, fileCallback?: FileCallback, dirCallback?: DirCallback): void {
  const files: string[] = readdirSync(normalize(dir))
  files.forEach((file) => {
    const uri = join(dir, file)
    const stat = statSync(uri)
    const isDirectory = stat.isDirectory()
    if (isDirectory && typeof dirCallback === 'function') {
      const res = dirCallback(uri)
      const isContinue = res !== false
      if (isContinue) {
        findDeep(uri, fileCallback, dirCallback)
      }
    } else if (typeof fileCallback === 'function') {
      fileCallback(uri)
    }
  })
}

/**
 * 获取文件夹中所有文件的路径,
 * 其中会自动跳过 ignorePaths 相关的内容
 * @param {string} dir 文件夹地址
 * @returns {string[]} 所有文件的路径
 */
export function getDeepFiles(dir: string): string[] {
  const files: string[] = []
  findDeep(dir, (file) => {
    files.push(file)
  }, (dir) => {
    return !ignorePaths.some(p => dir.includes(p))
  })
  return files
}
