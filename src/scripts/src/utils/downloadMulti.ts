import path from 'node:path'
import fs from 'fs-extra'
import puppeteer from 'puppeteer-core'

console.time('program initial')

let resolveTrigger = (_uri: string, _buffer: any) => {}
let rejectTrigger = (_e: Error) => {}

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  defaultViewport: {
    width: 1185,
    height: 800,
  },
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  timeout: 60000,
})

const page = await browser.newPage()
page.on('response', async (res) => {
  const uri = res.url()
  if (!/\.jpe?g|png|webp$/.test(uri)) return
  try {
    const buffer = await res.buffer()
    resolveTrigger(uri, buffer)
  } catch (e: any) {
    rejectTrigger(e)
  }
})

function createTempHTML(urls: string[]) {
  const imgsHtml = urls.reduce((re, uri) => {
    console.time(uri)
    return `${re}<img src="${uri}" />\n`
  }, '')
  const html = `<!doctype html>
<html lang="zh-cmn-Hans">
  <head>
    <meta charset="UTF-8" />
  </head>
  <body>
    ${imgsHtml}
  </body>
</html>`
  return html
}

function createTempHTMLFile(html: string, output: string) {
  const tempFile = path.join(output, 'temp.html')
  fs.writeFileSync(tempFile, html, 'utf8')
  return tempFile
}

async function downloadMulti(urls: string[], output: string) {
  console.timeEnd('program initial')
  const html = createTempHTML(urls)
  const tempFile = createTempHTMLFile(html, output)
  let restCount = urls.length

  return new Promise((resolve, reject) => {
    resolveTrigger = async (uri, buffer) => {
      const targetFile = path.join(output, path.basename(uri))
      fs.writeFileSync(targetFile, buffer, 'utf8')
      console.timeEnd(uri)
      if (--restCount <= 0) {
        resolve(undefined)
        fs.removeSync(tempFile)
        await browser.close()
      }
    }
    rejectTrigger = reject
    page.goto(`file://${tempFile}`)
  })
}
export default downloadMulti
