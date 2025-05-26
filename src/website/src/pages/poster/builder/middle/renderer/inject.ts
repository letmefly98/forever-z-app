import type { InjectionKey } from 'vue'

export const rendererInjectKey: InjectionKey<{
  mode: 'edit' | 'preview'
}> = Symbol('Descriptions')
