import { normalize } from 'node:path'
import { badCodeDirs, codeDirs, waitCodeDirs } from '../../config'
import { getDeepFiles } from './findDeep'
import { useCache } from './index'

/**
 * 获取所有的番号文件
 */
function _getAllCodeFiles(dirs = [...codeDirs, ...waitCodeDirs, ...badCodeDirs]) {
  const allDirs = dirs.map(normalize)
  const allFiles = allDirs.reduce((re: string[], dir) => re.concat(getDeepFiles(dir)), [])
  return allFiles
}
export const getAllCodeFiles = useCache(_getAllCodeFiles) as (dirs?: string[]) => string[]
