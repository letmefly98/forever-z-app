import type { FormItem } from './form-item'

export interface PropertyItem {
  type: string
  alias: string
  controls: FormItem[]
}
