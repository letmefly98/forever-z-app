<script setup lang="ts">
import { isPlainObject, throttle } from 'lodash-es'
import { computed, onMounted, onUnmounted, ref, version } from 'vue'

interface Props {
  // 选中项数据
  modelValue: any
  // 请求接口
  ajax: (params: LoadSelectAjaxParams) => Promise<LoadSelectAjaxResult>
  // 回显时必传的展示内容。因为 modelValue 通常为 ID，而接口未发生所以需此字段
  valueName?: string
  // 滚动触底距离
  threshold?: number
  // 指定分页大小
  defaultPageSize?: number
  // 用于数组型数据，自定义 option value key
  valueKey?: string
  // 用于数组型数据，自定义 option label key
  labelKey?: string
  // 多选时数据需特别处理
  multiple?: boolean
  // ... 以及其他 el-select 可接受的属性
}

// 请求接口入参格式
interface LoadSelectAjaxParams {
  words: string
  pageNo: number
  pageSize: number
  isRefresh: boolean
}

// 请求接口返回格式
interface LoadSelectAjaxResult {
  records: any[]
  total: number
}

const props = withDefaults(defineProps<Props>(), {
  // modelValue: '',
  // ajax: () => Promise.resolve({ total: 0, records: [] as any[] }),
  valueName: '',
  threshold: 50,
  defaultPageSize: 10,
  valueKey: 'id',
  labelKey: 'name',
  multiple: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'changed', chosen: any[]): any
  // ... 以及其他 el-select 可发出的事件
}>()

defineSlots<{
  default: () => any
  option: (props: { row: any, value: any, label: string }) => any
  after: () => any
  // ... 以及其他 el-select 支持的插槽
}>()

const selectRef = ref<any>()
const ajaxOptions = ref<any[]>([]) // 已请求数据
const total = ref(0) // 请求数据反馈的总量
const words = ref('') // 搜索文本
const pageNo = ref(1) // 当前请求页码
const loading = ref<0 | 1 | 2>(0) // 0无请求中 1显示请求中 2请求中但不显示
const isVue2 = version.startsWith('2')
const options = computed(() => {
  if (!ajaxOptions.value.length && props.valueName) {
    const row = { value: props.modelValue, label: props.valueName }
    return [{ row, ...row }]
  }
  return ajaxOptions.value.map(row => ({ row, value: getOptionValue(row), label: getOptionLabel(row) }))
})

onMounted(() => {
  const wrapRef = getScrollerWrapDom()
  wrapRef && wrapRef.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  const wrapRef = getScrollerWrapDom()
  wrapRef && wrapRef.removeEventListener('scroll', handleScroll)
})

// 传入 el-select 的 remote-method
const handleRemoteMethod = throttle(async (input: string, isRefresh = true, opts: any = {}) => {
  try {
    const { noLoading = false } = opts
    words.value = input
    if (loading.value > 0) return
    loading.value = noLoading ? 2 : 1
    pageNo.value = isRefresh ? 1 : pageNo.value + 1
    const res = await props.ajax({
      words: words.value,
      pageNo: pageNo.value,
      pageSize: props.defaultPageSize,
      isRefresh,
    })
    ajaxOptions.value = isRefresh ? res.records : ajaxOptions.value.concat(res.records)
    total.value = res.total
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = 0
  }
}, 300, { trailing: false })

// 下拉框滚动事件回调
function handleScroll(ev: Event) {
  const { scrollTop, scrollHeight, offsetHeight } = ev.target as HTMLElement
  if (scrollTop + offsetHeight >= scrollHeight - props.threshold) {
    handleScrollToBottom()
  }
}

function handleScrollToBottom() {
  if (total.value > options.value.length) {
    handleRemoteMethod(words.value, false, { noLoading: true })
  }
}

// 当下拉框出现时开始请求，关闭时清空数据
function handleVisibleChange(visible: boolean) {
  if (visible) {
    ajaxOptions.value = []
    handleRemoteMethod('', true)
  } else {
    words.value = ''
  }
}

// 监听 el-select 的 change 事件，除默认返回外，另提供更全的 option row 数据
function handleChange(val: any) {
  emit('update:modelValue', val)
  const raw = getOptionRawData(val)
  emit('changed', raw)
}

// 获取下拉框中滚动区域的 DOM
function getScrollerWrapDom() {
  if (!selectRef.value) return undefined
  const wrapRef = isVue2 ? selectRef.value.$refs?.scrollbar?.$refs?.wrapRef : selectRef.value.scrollbarRef?.wrapRef
  if (!wrapRef) return undefined
  return wrapRef
}

// 获取 option value
function getOptionValue(row: any) {
  if (isPlainObject(row)) return row[props.valueKey]
  return row
}

// 获取 option label
function getOptionLabel(row: any) {
  if (isPlainObject(row)) return row[props.labelKey]
  return row
}

// 根据 modelValue 找到 ajaxOptions 中的对应数据
function getOptionRawData(value: any) {
  const row = ajaxOptions.value.find((row: any) => {
    const optionValue = getOptionValue(row)
    if (props.multiple) return value.includes(optionValue)
    return value === optionValue
  })
  return row
}
</script>

<template>
  <el-select
    v-bind="$attrs"
    ref="selectRef"
    :model-value="props.modelValue"
    filterable
    remote
    :remote-method="handleRemoteMethod"
    :loading="loading === 1"
    :multiple="props.multiple"
    no-data-text="暂无数据"
    @visible-change="handleVisibleChange"
    @change="handleChange"
  >
    <slot name="default" />
    <template v-if="options.length">
      <template v-for="item in options" :key="item.value">
        <slot name="option" :row="item.row" :value="item.value" :label="item.label">
          <el-option :value="item.value" :label="item.label" />
        </slot>
      </template>
    </template>
    <slot name="after" />
  </el-select>
</template>
