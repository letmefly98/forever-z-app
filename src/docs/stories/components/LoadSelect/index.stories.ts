import type { Meta, StoryObj } from '@storybook/vue3'
import { LoadSelect } from 'common'
import { ref } from 'vue'
import { createObjectData, createStringData, mockGetData } from './mock-data'

const meta: Meta<typeof LoadSelect> = {
  title: 'Example/LoadSelect',
  component: LoadSelect,
  argTypes: {
    modelValue: { description: '选中项数据' },
    ajax: { description: '请求函数' },
    valueName: { description: '回显时必传的展示内容', control: 'text' },
    threshold: { description: '滚动触底距离', control: { type: 'number', min: 0, step: 1 } },
    defaultPageSize: { description: '指定分页大小', control: { type: 'number', min: 0, step: 1 } },
    valueKey: { description: '数组型数据时自定义 option value key', control: 'text' },
    labelKey: { description: '数组型数据时自定义 option label key', control: 'text' },
    multiple: { description: '数据可多选', control: 'boolean' },
    // @ts-expect-error: Unreachable code error
    onChange: {},
    onChanged: {},
  },
}
export default meta

// 案例模板
const LoadSelectExampleTemplate: StoryObj<typeof LoadSelect> = {
  render: args => ({
    components: { LoadSelect },
    setup: () => {
      const modelValue = ref(args.modelValue)
      return { args, modelValue }
    },
    template: `
      <LoadSelect v-bind="args" v-model="modelValue" />
    `,
  }),
}

// 常规使用
export const Basic: StoryObj<typeof LoadSelect> = {
  args: {
    modelValue: '',
    ajax: mockGetData(createStringData),
  },
  ...LoadSelectExampleTemplate,
}

// 请求数据为 json 格式
export const JsonData: StoryObj<typeof LoadSelect> = {
  args: {
    modelValue: '',
    ajax: mockGetData(createObjectData),
    valueKey: 'id',
    labelKey: 'name',
  },
  ...LoadSelectExampleTemplate,
}

// 请求数据为空数组
export const AjaxNoData: StoryObj<typeof LoadSelect> = {
  args: {
    modelValue: '',
    ajax: mockGetData(() => []),
    valueKey: 'id',
    labelKey: 'name',
  },
  ...LoadSelectExampleTemplate,
}

// 数据为 json 格式
export const HasValue: StoryObj<typeof LoadSelect> = {
  args: {
    modelValue: 31,
    valueName: '赵六0',
    ajax: mockGetData(createObjectData),
    valueKey: 'id',
    labelKey: 'name',
  },
  ...LoadSelectExampleTemplate,
}
