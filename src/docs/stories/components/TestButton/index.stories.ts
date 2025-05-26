import type { Meta, StoryObj } from '@storybook/vue3'
import { TestButton } from 'common'

const meta: Meta<typeof TestButton> = {
  title: 'Example/TestButton',
  component: TestButton,
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: {
      control: 'color',
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['small', 'medium', 'large'],
    },
    // @ts-expect-error: Unreachable code error
    onClick: {},
  },
}
export default meta

export const Primary: StoryObj<typeof TestButton> = {
  args: {
    primary: true,
    label: 'Button',
  },
}

export const Secondary: StoryObj<typeof TestButton> = {
  args: {
    label: 'Button',
  },
}

export const Large: StoryObj<typeof TestButton> = {
  args: {
    size: 'large',
    label: 'Button',
  },
}

export const Small: StoryObj<typeof TestButton> = {
  args: {
    size: 'small',
    label: 'Button',
  },
}
