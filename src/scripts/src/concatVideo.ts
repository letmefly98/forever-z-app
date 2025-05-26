import { writeFileSync } from 'node:fs'
import { dirname, parse, resolve } from 'node:path'
import chalk from 'chalk'
import spawn from 'cross-spawn'
import { ensureDirSync } from 'fs-extra'
import { desktopPath } from '../config'
import { getCodeName, removeCodeNamePart } from './utils/codeName'
import { findDeep } from './utils/findDeep'
import { askConfirm } from './utils/question'

interface MatchVideoData {
  name: string
  file: string
}

interface ConcatVideoData {
  code: string
  files: MatchVideoData[]
}

const thisDir = dirname(process.argv[1])
const tmpDir = resolve(thisDir, 'dist')
const tmpFile = resolve(tmpDir, 'concat-video.txt')

// 找到 1.mp4 2.mp4 等文件
const VideoReg = /\.(?:mp4|rmvb|avi|wmv|mkv)$/
function getVideoFiles(dir: string) {
  const result: MatchVideoData[] = []
  const isVideo = (name: string) => VideoReg.test(name)
  findDeep(dir, (file) => {
    const { name, base } = parse(file)
    if (isVideo(base)) result.push({ name, file })
  }, () => false)
  return result
}

// 从中找到相似番号的视频
function getConcatData(videos: MatchVideoData[]) {
  // 找到番号相近的，格式为 { code: [video] }
  const relative: { [code: string]: MatchVideoData[] } = {}
  videos.forEach((video) => {
    const { name } = video
    const code = removeCodeNamePart(getCodeName(name))
    if (!relative[code]) relative[code] = [video]
    else relative[code].push(video)
  })

  // 筛选出番号相近文件数有两个及以上的
  const result = Object.keys(relative).reduce((re, code) => {
    if (!code) return re
    if (relative[code].length < 2) return re
    return re.concat({ code, files: relative[code] })
  }, [] as ConcatVideoData[])

  return result
}

// 拼凑合并番号所需要的 ffmpeg 数据
function getConcatResultData(data: ConcatVideoData) {
  return data.files.map(({ file }) => `file ${file.replace(/\\/g, '\\\\')}`).join('\n')
}

// 根据数据合并视频
async function concatVideo(data: ConcatVideoData) {
  ensureDirSync(tmpDir)
  const outputPath = resolve(desktopPath, `${data.code}.mp4`)
  const txt = getConcatResultData(data)
  console.log(txt)
  const confirm = await askConfirm(`确认导出到 ${chalk.green(outputPath)}`)
  if (!confirm) return
  writeFileSync(tmpFile, txt, 'utf8')
  spawn.sync('cmd.exe', ['/c', `ffmpeg -y -f concat -safe 0 -i ${tmpFile} -c copy ${outputPath}`], { stdio: 'inherit' })
}

/**
 * 若由脚本启动，则直接运行
 */
(async () => {
  if (process.env.RUN_BY === 'scripts') {
    const args = process.argv.slice(2)
    const [codeByCli = desktopPath] = args
    const videos = getVideoFiles(codeByCli)
    const list = getConcatData(videos)
    concatVideo(list[0])
  }
})()
