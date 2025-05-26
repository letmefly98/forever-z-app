import inquirer from 'inquirer'

/**
 * inquirer 相关的封装
 * @module askText 询问文本输入
 * @module askChoice 询问选项选择
 */

/**
 * 询问并获取用户输入
 * @param title 询问文案
 * @returns 用户输入内容
 */
export async function askText(title: string): Promise<string> {
  const result = await inquirer.prompt([
    {
      type: 'input',
      name: 'text',
      message: title,
    },
  ])
  const { text } = result || {}
  return text
}

/**
 * 询问选项并获取用户选择
 * @param title 询问文案
 * @param choices 选项列表，格式为 { value, name }
 * @returns 用户选择选择
 */
export async function askChoice(title: string, choices: Choice[]): Promise<any> {
  const result = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      choices,
      message: title,
    },
  ])
  const { choice } = result || {}
  return choice
}
export interface Choice {
  name: string
  value: any
}

/**
 * 确认是否
 * @returns boolean
 */
export async function askConfirm(title: string): Promise<boolean> {
  const result = await inquirer.prompt([
    {

      type: 'confirm',
      name: 'confirm',
      message: title,
    },
  ])
  const { confirm } = result || {}
  return confirm
}
