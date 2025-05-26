import type { BrowserWindow } from 'electron'

// 浏览器池 ids
type BrowserPoolIds = 'Backup' | 'Skeleton' | 'Main' | 'MapEditor'

// 在用的浏览器池
export const BrowserPools: { [key in BrowserPoolIds]: BrowserWindow | null } = {
  Backup: null,
  Skeleton: null,
  Main: null,
  MapEditor: null,
}
