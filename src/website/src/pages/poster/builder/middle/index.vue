<script setup lang="ts">
import * as CompsConfig from '@/pages/poster/core/comps/index'
import usePosterBuilderStore from '../biz/stores/index.store'
import Renderer from './renderer/index.vue'

const store = usePosterBuilderStore()

function handleDragEnter(e: DragEvent) {
  const $item = (e.target as HTMLElement).closest('.main')
  $item.classList.add('dragging')
}
function handleDragLeave(e: DragEvent) {
  const $item = (e.target as HTMLElement).closest('.main')
  $item.classList.remove('dragging')
}

function handleDropOver(e: DragEvent) {
  e.preventDefault()

  // e.dataTransfer.dropEffect = 'none'

  // const data = e.dataTransfer.getData('text')
  // console.log(e, data)
}

function handleDrop(e: DragEvent) {
  e.preventDefault()

  const $item = (e.target as HTMLElement).closest('.main')
  $item.classList.remove('dragging')

  const type = e.dataTransfer.getData('text/plain')
  console.log(e, type, e.dataTransfer.effectAllowed)

  // let files = e.dataTransfer.files || []
  // if (e.dataTransfer.items) {
  //   files = Array.from(e.dataTransfer.items).filter(e => e.kind === 'file').map(e => e.getAsFile())
  // }

  const Comp = CompsConfig[type]
  if (!Comp) return

  const data = store.addItem(Comp)
  store.setCurrent(data)
}
</script>

<template>
  <div class="main" @dragover="handleDropOver" @dragenter="handleDragEnter" @dragleave="handleDragLeave" @drop="handleDrop">
    <Renderer :layout="store.layout" mode="edit" />
  </div>
</template>

<style lang="less" scoped>
.main {
  border: 1px solid #eee;
  min-height: 80vh;
  &.dragging {
    border-color: #ccc;
  }
}
</style>
