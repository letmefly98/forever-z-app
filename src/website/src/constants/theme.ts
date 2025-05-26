/**
 * 主题值
 */
export type Theme = 'light' | 'dark'

/**
 * 主题值的缓存索引
 */
const themeStorageKey = 'theme'

/**
 * 初始的主题值
 * @constant {Theme}
 */
export const initialTheme = (() => {
  if (typeof window !== 'undefined') {
    const cachedTheme = localStorage.getItem(themeStorageKey)
    if (cachedTheme) return cachedTheme as Theme

    const themeMedia = window.matchMedia('(prefers-color-scheme: light)')
    if (themeMedia) return themeMedia.matches ? 'light' : 'dark'
  }

  return 'light'
})()

/**
 * 修改主题值
 * @param {Theme} theme 主题值
 * @param {boolean} [initial] 是否是初始
 */
export function changeTheme(theme: Theme, initial: boolean = false): void {
  document.documentElement.setAttribute('data-theme', theme)
  !initial && saveTheme(theme)
}

/**
 * 缓存主题值
 * @param {Theme} theme 主题值
 */
export function saveTheme(theme: Theme): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(themeStorageKey, theme)
}
