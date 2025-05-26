<script setup lang="ts">
import type { INFO_LIST_PROVIDE } from './index.vue'
import { computed, inject } from 'vue'
import { calculateUnitNumber } from '../../utils/index'

interface Props {
  // 介绍词
  label?: string
  // 介绍词宽度，会覆盖 InfoList 父组件的值
  labelWidth?: 'auto' | string | number
  // 介绍词所在位置，会覆盖 InfoList 父组件的值
  labelPosition?: 'left' | 'right' | 'top'
  // 介绍词与内容之间的文本
  connection?: string
  // 内容
  value?: string | number
  // 鼠标在内容上悬停时显示的内容
  tooltip?: string | number
  // 内容超长时是否显示省略号
  ellipsis?: boolean
}

defineOptions({
  name: 'InfoListItem',
})

const props = withDefaults(defineProps<Props>(), {
  label: '',
  labelWidth: undefined,
  labelPosition: undefined,
  connection: undefined,
  value: '',
  tooltip: '',
  ellipsis: true,
})

defineSlots<{
  'default': (props: { value: Props['value'], tooltip: Props['tooltip'] }) => any
  'label': (props: { label: Props['label'] }) => any
  'before-label': () => any
  'after-label': () => any
  'after-value': () => any
}>()

// 由 InfoList 父组件来的数据
const ctx = inject<INFO_LIST_PROVIDE>('INFO_LIST_PROVIDE', {})

// 介绍词定宽，获取 css 实际值
const labelWidth = computed(() => {
  if (ctx.labelPosition === 'top') return ''
  if (ctx.labelWidth) return calculateUnitNumber(ctx.labelWidth)
  return calculateUnitNumber(props.labelWidth)
})

// 介绍词位置样式
const labelPositionClass = computed(() => {
  if (!props.labelPosition) return '' // 本组件没设置则使用父级
  return props.labelPosition ? `label-at-${props.labelPosition}` : ''
})

// 介绍词与内容之间的文本
const connectionTxt = computed(() => {
  return typeof props.connection === 'string' ? props.connection : typeof ctx.connection === 'string' ? ctx.connection : ''
})
</script>

<template>
  <div class="info-list-item" :class="labelPositionClass">
    <div v-if="props.label || $slots.label" class="label" :style="{ width: labelWidth }">
      <slot name="label" :label="props.label">
        <span v-if="$slots['before-label']" class="before-label">
          <slot name="before-label" />
        </span>
        <span class="text">
          <span>{{ props.label }}</span>
          <span v-if="!!connectionTxt" class="connection">{{ connectionTxt }}</span>
        </span>
        <span v-if="$slots['after-label']" class="after-label">
          <slot name="after-label" />
        </span>
      </slot>
    </div>
    <div class="value" :class="{ ellipsis }">
      <slot :value="props.value" :tooltip="props.tooltip">
        <el-tooltip :disabled="!props.tooltip" :content="String(props.tooltip)" placement="top">
          <div class="text" :title="String(props.value)">
            {{ props.value }}
          </div>
        </el-tooltip>
        <span v-if="$slots['after-value']" class="after-value">
          <slot name="after-value" />
        </span>
      </slot>
    </div>
  </div>
</template>

<style scoped lang="less">
@import "../../styles/mixins.less";
.info-list-item {
  --info-list-item-label-color: inherit;
  --info-list-item-value-color: rgba(15, 24, 41, 0.7);
  --info-list-item-gap: 16px;
  --info-list-item-content-gap: 4px;
}

.info-list-item {
  display: flex;
  align-items: baseline;
  gap: var(--info-list-item-gap);

  &.label-at-top {
    display: block;
  }

  &.label-at-right {
    .label {
      justify-content: flex-end;
    }
  }

  .label {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: var(--info-list-item-content-gap);
    .text {
      color: var(--info-list-item-label-color);
    }
  }

  .value {
    display: flex;
    align-items: center;
    gap: var(--info-list-item-content-gap);
    .text {
      color: var(--info-list-item-value-color);
    }

    &.ellipsis {
      overflow: hidden;
      & > .text {
        .text-overflow();
      }
    }
  }

  .before-label,
  .after-label,
  .after-value {
    display: flex;
    align-items: center;
  }
}
</style>
