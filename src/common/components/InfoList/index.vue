<script setup lang="ts">
import { computed, provide } from 'vue'
import { calculateUnitNumber } from '../../utils/index'

interface Props {
  // 介绍词宽度
  labelWidth?: 'auto' | string | number
  // 介绍词所在位置
  labelPosition?: 'left' | 'right' | 'top'
  // 介绍词与内容之间的文本
  connection?: string
  // 多栏样式
  column?: number
  // 多栏之间的空隙
  columnGap?: 'auto' | string | number
}

defineOptions({
  name: 'InfoList',
})

const props = withDefaults(defineProps<Props>(), {
  labelWidth: undefined,
  labelPosition: undefined,
  connection: ':',
  column: undefined,
  columnGap: undefined,
})

defineSlots<{
  default: () => any
}>()

// 传递数据给 InfoListItem 子组件用
export type INFO_LIST_PROVIDE = Props
provide<INFO_LIST_PROVIDE>('INFO_LIST_PROVIDE', props)

// 介绍词位置样式
const labelPositionClass = computed(() => {
  if (!props.labelPosition) return ''
  return props.labelPosition ? `label-at-${props.labelPosition}` : ''
})

// 多栏布局样式
const columnNumber = computed(() => props.column && props.column > 1 ? props.column : 1)
const columnClass = computed(() => columnNumber.value > 1 ? `column-row` : '')
const columnGap = computed(() => props.columnGap ? calculateUnitNumber(props.columnGap) : '0px')
</script>

<template>
  <div class="info-list" :class="[labelPositionClass, columnClass]">
    <div class="info-list-wrap">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="less">
@import "../../styles/mixins.less";

.info-list {
  --info-list-row-gap: 8px;
  --info-list-column: v-bind(columnNumber);
  --info-list-column-gap: v-bind(columnGap);
}

.info-list {
  .info-list-wrap {
    .items-gap(var(--info-list-row-gap), bottom);
  }

  &.label-at-top {
    :deep(.info-list-item) {
      display: block;
    }
  }

  &.label-at-right {
    :deep(.info-list-item) {
      .label {
        justify-content: flex-end;
      }
    }
  }

  &.column-row {
    overflow: hidden;
    .info-list-wrap {
      .column-row(var(--info-list-column), ~':deep(.info-list-item)', var(--info-list-column-gap), var(--info-list-row-gap));
    }
  }
}
</style>
