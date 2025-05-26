<script setup lang="ts">
import { cloneDeep, isObject } from 'lodash-es'
import { computed } from 'vue'

interface Props {
  menus: any[] | string[]
  valueKey?: string
  labelKey?: string
  clickable?: boolean
}

defineOptions({
  name: 'RightClickMenu',
})

const props = withDefaults(defineProps<Props>(), {
  menus: () => [],
  valueKey: '',
  labelKey: '',
  clickable: false, // TODO: 同时支持鼠标左右键点击，为实现
})

const emit = defineEmits<{
  (e: 'command', item: string | any): void
}>()

defineSlots<{
  default: () => any
  dropdown: () => any
  item: (props: { row: any, label: string }) => any
}>()

const innerMenus = computed<({ raw: any, value: any, label: string, disabled: boolean })[]>(() => {
  return props.menus.map((item: string | any) => ({
    raw: item,
    value: props.valueKey ? item[props.valueKey] : item,
    label: props.labelKey ? item[props.labelKey] : item,
    disabled: isObject(item) as any ? item.disabled : false,
  }))
})

function onCommand(item: string | any) {
  emit('command', cloneDeep(item))
}
</script>

<template>
  <el-dropdown trigger="contextmenu" v-bind="$attrs">
    <template #default>
      <slot>
        <span>···</span>
      </slot>
    </template>
    <template #dropdown>
      <slot name="dropdown">
        <el-dropdown-menu>
          <template v-for="item in innerMenus" :key="item.value">
            <el-dropdown-item :disabled="item.disabled" @click="onCommand(item.raw)">
              <slot name="item" :row="item.raw" :label="item.label">
                {{ item.label }}
              </slot>
            </el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </slot>
    </template>
  </el-dropdown>
</template>
