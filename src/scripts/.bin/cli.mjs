#!/usr/bin/env node

import path from 'node:path'
import url from 'node:url'
import { program } from 'commander'
import { spawn } from 'cross-spawn'
import fs from 'fs-extra'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const scriptsRootDir = path.join(__dirname, '..')

const pkgPath = path.resolve(scriptsRootDir, 'package.json')
const pkg = fs.readJSONSync(pkgPath)

program
  .name('forZ')
  .description('来自 forever-z-133 的脚本')
  .version(pkg.version)

program
  .command('check')
  .description('番号名称规范检查')
  .action(() => run('check'))

program
  .command('rename')
  .description('番号名称规范化')
  .argument('[fileDir]', '需操作的文件夹')
  .action(fileDir => run('rename', fileDir))

program
  .command('remove')
  .description('删除觉得不好看的番号')
  .argument('[code]', '需删除的番号')
  .action(code => run('remove', code))

program
  .command('exist')
  .description('查找番号是否存在')
  .argument('[code]', '需查找的番号')
  .action(code => run('exist', code))

program
  .command('concat')
  .description('合并多个视频文件')
  .action(() => run('concat'))

program
  .command('pick')
  .description('提取文件中未下载的番号链接')
  .argument('[file...]', '需查找的番号')
  .action(args => run('pick', args.join(' ')))

program
  .command('rm')
  .description('批量清理文件')
  .argument('[file...]', '要清理的文件夹')
  .action(args => run('rm', args.join(' ')))

program
  .command('unzip')
  .description('批量解压带密码的zip文件')
  .action(() => run('unzip'))

program
  .command('anime')
  .description('批量清除动画视频后缀')
  .action(() => run('anime'))

program
  .command('pic')
  .description('下载写真图')
  .action(() => run('pic'))

program
  .command('test')
  .description('测试脚本')
  .argument('[args...]', '测试脚本的入参')
  .action(args => run('test', ...args))

program.parse()

function run(command, ...args) {
  spawn('npm', ['run', command, ...args.filter(a => a && a !== 'undefined')], { stdio: 'inherit', cwd: scriptsRootDir })
}
