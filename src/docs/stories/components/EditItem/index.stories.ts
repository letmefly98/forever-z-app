import type { Meta, StoryObj } from '@storybook/vue3'
import { EditItem } from 'common'
import { ref } from 'vue'

const meta: Meta<typeof EditItem> = {
  title: 'Example/EditItem',
  component: EditItem,
  argTypes: {
    modelValue: { description: '数据值' },
    autoClose: { description: '是否自动关闭' },
    controlType: { description: '数据修改方式', options: ['input', 'input-number', 'textarea', 'select', 'checkbox', 'radio'] },
    controlAttrs: { description: '数据修改组件的属性' },
    controlOptions: { description: 'select/checkbox/radio修改方式时的可选项' },
    onConfirm: {},
    onStart: {},
    onCancel: {},
  },
}
export default meta

// 常规使用
export const Basic: StoryObj<typeof EditItem> = {
  args: {
    modelValue: 'A',
    autoClose: true,
    controlType: 'input',
    controlAttrs: undefined,
    controlOptions: [{ value: 'A', label: '选项A' }, { value: 'B', label: '选项B' }],
  },
  render: args => ({
    components: { EditItem },
    setup: () => ({ args }),
    template: `<EditItem v-bind="args" v-model="args.modelValue" />`,
  }),
}

// 异步确认
export const WithAjax: StoryObj<typeof EditItem> = {
  args: {
    modelValue: 'A',
    autoClose: false,
  },
  render: args => ({
    components: { EditItem },
    setup() {
      const loading = ref(false)
      const handleConfirm = async (value: string, close: VoidFunction) => {
        loading.value = true
        await new Promise(resolve => setTimeout(resolve, 1000))
        args.modelValue = value
        close()
        loading.value = false
      }
      return { args, loading, handleConfirm }
    },
    template: `
      <EditItem v-bind="args" @confirm="handleConfirm" />
      <span>{{ loading ? 'changing' : '' }}</span>
    `,
  }),
}
