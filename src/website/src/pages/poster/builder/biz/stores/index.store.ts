import type { CompItem } from '@/pages/poster/core/types/comps'
import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const usePosterBuilderStore = defineStore('poster-builder', () => {
  const layout = ref([] as CompItem[])
  const current = ref({} as CompItem)

  function addItem(config: CompItem) {
    const data = cloneDeep(config)
    const uuid = Math.random().toString(16).slice(2, 14)
    data.id = `${data.type}-${uuid}`
    layout.value.push(data)
    return data
  }

  function setCurrent(data: CompItem) {
    current.value = cloneDeep(data)
  }

  return {
    layout,
    current,
    addItem,
    setCurrent,
  }
})
export default usePosterBuilderStore
