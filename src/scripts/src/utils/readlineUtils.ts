/**
 * 调试面板切到下一行
 */
export function logNextLine() {
  process.stdout.write('\n', 'utf-8')
}

/**
 * 获取面板进度条渲染所需的数据
 * @param current 当前数
 * @param total 总数
 * @returns 进度条数据 { empty: string, filled: string }
 */
export function getLogProgressData(current: number, total: number) {
  const length = 25
  const percent = Number((current / total).toFixed(2))
  const cell_num = Math.floor(percent * length) // 计算需要多少个黑条

  let filled = '' // 黑色条
  for (let i = 0; i < cell_num; i++) filled += '█'

  let empty = '' // 灰色条
  for (let i = 0; i < length - cell_num; i++) empty += '░'

  return { empty, filled }
}

/**
 * 单行面板进度条
 * @param current 当前数
 * @param total 总数
 */
export function logProgress(current: number, total: number) {
  const { empty, filled } = getLogProgressData(current, total)
  const percent = (current / total * 100).toFixed(2)

  const text = `进度:  ${filled}${empty} ${percent}%`

  process.stdout.clearLine(0)
  process.stdout.cursorTo(0)

  process.stdout.write(text, 'utf-8')
}
