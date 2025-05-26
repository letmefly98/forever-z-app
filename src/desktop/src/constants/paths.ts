import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { app } from 'electron'

export const UserDataDir = app.getPath('userData')

export const desktopRootDir = typeof __dirname === 'string' ? __dirname : dirname(fileURLToPath(import.meta.url))
