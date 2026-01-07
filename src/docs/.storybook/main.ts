import type { StorybookConfig } from '@storybook/vue3-vite'
// import { mergeConfig } from 'vite'
// import customConfig from '../vite.config.ts'

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  docs: {
    // autodocs: 'tag',
  },
  // async viteFinal(config) {
  //   return mergeConfig(config, customConfig)
  // },
}
export default config
