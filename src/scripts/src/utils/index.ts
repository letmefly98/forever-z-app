/**
 * 补零
 * @param {number} num 数字
 * @param {number} len 长度
 * @returns {string} 补零后的字符串结果
 */
export function addZero(num: number | string, len: number = 2): string {
  let result = Number.isNaN(+num) ? '' : (`${num}`)
  let numLen = result.length
  while (numLen++ < len) result = `0${result}`
  return result
}

/**
 * 判断是否为数字字符串
 * @param {string} str 字符串
 * @returns {boolean} 字符串是个数字
 */
export function isNumberString(str: string): boolean {
  return !Number.isNaN(Number.parseFloat(str))
}

/**
 * 缓存函数返回值，重复调用读取缓存
 * @param fn 需处理的函数
 * @returns 可重复调用的函数
 */
export function useCache<T>(fn: any) {
  const cache = {}
  return function (...args: any[]): T {
    const key = args.length + JSON.stringify(args)
    if (key in cache) return cache[key]
    cache[key] = fn.apply(fn, args)
    return cache[key]
  }
}
