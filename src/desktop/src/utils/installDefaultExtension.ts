import installExtension from 'electron-devtools-installer'

/**
 * 安装默认的 chrome 插件
 * 比如 vuejs devtool
 */
export default function installDefaultExtension() {
  return installExtension({
    id: 'nhdogjmejiglipccpnnnanhbledajbpd',
    // id: 'fjjopahebfkmlmkekebhacaklbhiefbn',
    electron: '>=1.2.1',
  })
    .then((name) => {
      console.log(`add extension: ${name}`)
    })
    .catch((err) => {
      console.log('devtools error: ', err)
    })
}
