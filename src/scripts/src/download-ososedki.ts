import path from 'node:path'
import fs from 'fs-extra'
import { addZero } from './utils'
import downloadMulti from './utils/downloadMulti'

export const title = 'Viper'.trim()
export const total = 4
export const zero = false
export const baseUri = 'https://ososedki.com/images/a/1280/-10000001/10010126/{{}}.webp'
// export const total = 99
// export const zero = true
// export const baseUri = 'https://ososedki.com/images/a/604/-165740836/284266161/4573127{{}}.webp'

export const output = path.resolve('C:/Users/Admin/Desktop/', title)
fs.ensureDirSync(output)

export const urls = Array.from({ length: total }, (_, i) => {
  const no = zero ? addZero(i) : String(i + 1)
  return `${baseUri.replace('{{}}', no)}`
})

await downloadMulti(urls, output)
