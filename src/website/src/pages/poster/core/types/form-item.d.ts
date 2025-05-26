export abstract class Base_FormItem {
  type: string
  default?: any
}

export class Text_FormItem implements Base_FormItem {
  type: 'text'
}

interface Number_FormItem {
  type: 'number'
  min?: number
  max?: number
  prefix?: string
  suffix?: string
}

interface Select_FormItem {
  type: 'select'
  default?: number
  options: { label: string, value: any }[]
}

export type FormItem = Text_FormItem
