import type { Meta, StoryObj } from '@storybook/vue3'
import { BaseLayout } from 'common'
import { ElCheckbox, ElCheckboxGroup } from 'element-plus'
import { computed, ref } from 'vue'
import Content from './mock/Content.vue'
import Footer from './mock/Footer.vue'
import Header from './mock/Header.vue'
import Left from './mock/Left.vue'
import Right from './mock/Right.vue'

const meta: Meta<typeof BaseLayout> = {
  title: 'Example/BaseLayout',
  component: BaseLayout,
  argTypes: {
    headerContainLeft: { description: '页首包含左侧' },
    headerContainRight: { description: '页首是否包含右侧' },
    footerContainLeft: { description: '页末是否包含左侧' },
    footerContainRight: { description: '页末是否包含右侧' },
  },
}
export default meta

// 案例模板
function BaseLayoutExampleTemplate(comps: string[]): StoryObj<typeof BaseLayout> {
  const components = { header: Header, default: Content, left: Left, right: Right, footer: Footer }
  return {
    render: args => ({
      components: { ElCheckboxGroup, ElCheckbox, BaseLayout, Header, Content, Left, Right, Footer },
      setup: () => {
        const options = ['header', 'left', 'right', 'footer']
        const chosen = ref(comps)
        const slots = computed(() => [...chosen.value, 'default'])
        return { args, components, slots, options, chosen }
      },
      template: `
        <div>
          <ElCheckboxGroup v-model="chosen" multiple>
            <template v-for="op in options" :key="op">
              <ElCheckbox :value="op" :label="op" />
            </template>
          </ElCheckboxGroup>
          <BaseLayout v-bind="args">
            <template v-for="name in slots" :key="name" #[name]>
              <component :is="components[name]" />
            </template>
          </BaseLayout>
        </div>
      `,
    }),
  }
}

// 常规使用
export const Basic: StoryObj<typeof BaseLayout> = {
  args: {
    headerContainLeft: true,
    headerContainRight: true,
    footerContainLeft: false,
    footerContainRight: true,
  },
  ...BaseLayoutExampleTemplate(['header', 'left', 'right', 'footer']),
}
