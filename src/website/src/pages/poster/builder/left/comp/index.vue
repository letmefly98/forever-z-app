<script setup lang="ts">
import type { CompItem } from '@/pages/poster/core/types/comps'
import * as CompsConfig from '@/pages/poster/core/comps/index'
import { ref } from 'vue'

const list = [CompsConfig.text, CompsConfig.image, CompsConfig.container]

const current = ref({} as CompItem)
const placeholder = ref<HTMLElement>()

// 拖拽时的占位图
// const placeholder = new Image()
// placeholder.src = 'https://fakeimg.pl/20x20/?text=test'

function handleDragStart(op: CompItem, e: DragEvent) {
  const $item = (e.target as HTMLElement).closest('.item')

  $item.classList.add('dragging')

  // e.dataTransfer.effectAllowed = 'copy'

  if (placeholder.value) {
    current.value = op
    const dom = placeholder.value as HTMLElement
    e.dataTransfer.setDragImage(dom, 0, 0)
  }

  e.dataTransfer.clearData()
  e.dataTransfer.setData('text/plain', op.type)
}
function handleDragEnd(op: CompItem, e: DragEvent) {
  const $item = (e.target as HTMLElement).closest('.item')
  $item.classList.remove('dragging')
}
</script>

<template>
  <div class="comp">
    <div class="list">
      <el-row class="list-wrapper" :gutter="20">
        <template v-for="op in list" :key="op.type">
          <el-col :span="8" class="item">
            <div class="item" draggable="true" @dragstart="handleDragStart(op, $event)" @dragend="handleDragEnd(op, $event)">
              <div class="preview">
                <img :src="op.preview" alt="" />
              </div>
              <div class="name">
                {{ op.alias }}
              </div>
            </div>
          </el-col>
        </template>
      </el-row>
    </div>
    <div ref="placeholder" class="placeholder">
      <div class="result">
        <div class="preview">
          <img :src="current.preview" />
        </div>
        <div class="name">
          {{ current.alias }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.item {
  text-align: center;
  // user-select: none;
  &.dragging {
    background-color: #ccc;
  }
  img {
    -webkit-user-drag: none;
  }
}
.preview {
  .ratio((350 / 200));
}
.placeholder {
  position: absolute;
  left: -9999em;
  // padding-left: 15px;
  .result {
    width: 30px;
  }
}

.ratio(@n: 1) {
  position: relative;
  &:before {
    content: '';
    display: block;
    padding-top: calc(100% / @n);
  }
  & > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
