import glob from 'fast-glob'
import fs from 'fs-extra'
import { desktopPath } from '../config'

function getVideoFiles() {
  const files: string[] = glob.sync(['*.mp4'], { cwd: desktopPath, dot: true, absolute: true })
  return files
}

function renameVideoFile(videoUri: string) {
  const newName = videoUri.replace(' - H動漫-裏番-線上看 - Hanime1.me', '')
  // console.log(videoUri, newName)
  fs.moveSync(videoUri, newName, { overwrite: true })
}

/**
 * 若由脚本启动，则直接运行
 */
(async () => {
  if (process.env.RUN_BY === 'scripts') {
    const videos = getVideoFiles()
    videos.forEach(renameVideoFile)
  }
})()
