<script setup lang="ts">
import type { CompItem } from '@/pages/poster/core/types/comps'
import usePosterBuilderStore from '../../biz/stores/index.store'

interface Props {
  data: CompItem
}
const props = withDefaults(defineProps<Props>(), {})

const store = usePosterBuilderStore()

function handleClick() {
  store.setCurrent(props.data)
}
</script>

<template>
  <div :id="props.data.id" class="edit-box" :class="{ current: store.current.id === props.data.id }" @click="handleClick">
    <slot />
  </div>
</template>

<style lang="less" scoped>
.edit-box {
  &.current {
    outline: 1px solid red;
  }
}
</style>
