export interface CompItem {
  id?: string
  type: string
  alias: string
  preview: string
  childrenAble?: boolean
  children?: CompItem[]
  props?: any
  style?: any
}
