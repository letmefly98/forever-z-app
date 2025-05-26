<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  label: string
  primary?: boolean
  size?: 'small' | 'medium' | 'large'
  backgroundColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  primary: false,
  size: 'medium',
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

function onClick() {
  emit('click')
}

const classes = computed(() => ({
  'storybook-button': true,
  'storybook-button--primary': props.primary,
  'storybook-button--secondary': !props.primary,
  [`storybook-button--${props.size}`]: true,
}))

const style = computed(() => ({
  backgroundColor: props.backgroundColor,
}))
</script>

<template>
  <button type="button" :class="classes" :style="style" @click="onClick">
    {{ label }}
  </button>
</template>

<style scoped lang="less">
.storybook-button {
  font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: 700;
  border: 0;
  border-radius: 3em;
  cursor: pointer;
  display: inline-block;
  line-height: 1;
}
.storybook-button--primary {
  color: white;
  background-color: #1ea7fd;
}
.storybook-button--secondary {
  color: #333;
  background-color: transparent;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset;
}
.storybook-button--small {
  font-size: 12px;
  padding: 10px 16px;
}
.storybook-button--medium {
  font-size: 14px;
  padding: 11px 20px;
}
.storybook-button--large {
  font-size: 16px;
  padding: 12px 24px;
}
</style>
