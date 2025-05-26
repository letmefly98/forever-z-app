export function isNumberString(str?: any) {
  // eslint-disable-next-line no-self-compare
  return +str === +str
}

// 比如 10 转为 10px，格式化 css 数字单位
export function calculateUnitNumber(str?: string | number) {
  if (!str || str === 'auto') return ''
  if (isNumberString(str)) return `${str}px`
  return str
}
