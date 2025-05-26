import type { Meta, StoryObj } from '@storybook/vue3'
import { CopyDocument, QuestionFilled } from '@element-plus/icons-vue'
import { InfoListItem } from 'common'
import { ElButton, ElTooltip } from 'element-plus'

const meta: Meta<typeof InfoListItem> = {
  title: 'Example/InfoListItem',
  component: InfoListItem,
  tags: ['autodocs'],
  argTypes: {
    // 由于 props 与 slots 有重名，需特殊处理
    'label': { description: '介绍词', control: 'text', table: { category: 'props', defaultValue: { summary: '\'\'' } } },
    'value': { description: '内容', control: 'text' },
    'tooltip': { description: '鼠标在内容上悬停时显示的内容', control: 'text' },
    'labelWidth': { description: '介绍词宽度，会覆盖 InfoList 父组件的值', control: 'text' },
    'labelPosition': { description: '介绍词所在位置，会覆盖 InfoList 父组件的值', options: ['left', 'right', 'top'] },
    'ellipsis': { description: '内容超长时是否显示省略号', control: 'boolean' },
    'connection': { description: '介绍词与内容之间的文本', control: 'text' },
    // @ts-expect-error: Unreachable code error
    'slot:label': { name: 'label', table: { category: 'slots' } },
  },
}
export default meta

// 常规使用
export const Basic: StoryObj<typeof InfoListItem> = {
  args: {
    label: '姓名',
    value: '张三',
    tooltip: '张三',
    labelWidth: 'auto',
    labelPosition: 'left',
    ellipsis: true,
    connection: '',
  },
}

// 自定义内容 - 介绍词增加气泡解释
export const AfterLabelSlot: StoryObj<typeof InfoListItem> = {
  args: {
    label: '运行时长',
    value: '0.00 小时',
  },
  render: args => ({
    components: { InfoListItem, ElTooltip, QuestionFilled },
    setup: () => ({ args }),
    template: `
      <InfoListItem v-bind="args">
        <template #after-label>
          <el-tooltip content="当前筛选条件下所有仿真任务中仿真时间数的总和（小时）">
            <span class="el-icon"><QuestionFilled /></span>
          </el-tooltip>
        </template>
      </InfoListItem>
    `,
  }),
}

// 自定义内容 - 内容增加其他按钮
export const AfterValueSlot: StoryObj<typeof InfoListItem> = {
  args: {
    label: '场景ID',
    value: '129031213',
  },
  render: args => ({
    components: { InfoListItem, ElButton, CopyDocument },
    setup: () => ({ args }),
    // eslint-disable-next-line no-alert
    methods: { alert: (text: string) => window.alert(text) },
    template: `
      <InfoListItem v-bind="args">
        <template #after-value>
          <el-button link type="primary" @click="alert('复制')">
            <span class="el-icon"><CopyDocument /></span>
          </el-button>
        </template>
      </InfoListItem>
    `,
  }),
}
