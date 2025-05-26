import cp from 'node:child_process'

/**
 * vite-plugin-electron 的 startup 扩展
 * 其实可接收来自 vite 的参数，注入进 electron 的 process.env
 *
 * @param argv spawn 的第二个参数，默认 ['.', '--no-sandbox']
 * @param options  spawn 的第三个参数，默认 { stdio: 'inherit' }
 */
export async function startup(argv = ['.', '--no-sandbox'], options) {
  const { spawn } = await import('node:child_process')
  const electron = await import('electron')
  const electronPath = electron.default ?? electron
  await startup.exit()
  const env = { ...process.env, ...options?.env }
  process.electronApp = spawn(electronPath, argv, { stdio: 'inherit', ...options, env })
  process.electronApp.once('exit', process.exit)
  if (!startup.hookedProcessExit) {
    startup.hookedProcessExit = true
    process.once('exit', startup.exit)
  }
}
startup.hookedProcessExit = false
startup.exit = async () => {
  if (process.electronApp) {
    process.electronApp.removeAllListeners()
    treeKillSync(process.electronApp.pid)
  }
}

export function treeKillSync(pid) {
  if (!pid) return
  if (process.platform === 'win32') {
    cp.execSync(`taskkill /pid ${pid} /T /F`)
  } else {
    killTree(pidTree({ pid, ppid: process.pid }))
  }
}

function pidTree(tree) {
  const command = process.platform === 'darwin'
    ? `pgrep -P ${tree.pid}` // Mac
    : `ps -o pid --no-headers --ppid ${tree.ppid}` // Linux

  try {
    const childs = cp
      .execSync(command, { encoding: 'utf8' })
      .match(/\d+/g)
      ?.map(id => +id)

    if (childs) {
      tree.children = childs.map(cid => pidTree({ pid: cid, ppid: tree.pid }))
    }
  } catch { }

  return tree
}

function killTree(tree) {
  if (tree.children) {
    for (const child of tree.children) {
      killTree(child)
    }
  }

  try {
    process.kill(tree.pid) // #214
  } catch { /* empty */ }
}
