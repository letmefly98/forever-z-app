<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  // 页首是否包含左侧
  headerContainLeft?: boolean
  // 页首是否包含右侧
  headerContainRight?: boolean
  // 页末是否包含左侧
  footerContainLeft?: boolean
  // 页末是否包含右侧
  footerContainRight?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  headerContainLeft: true,
  headerContainRight: true,
  footerContainLeft: false,
  footerContainRight: true,
})
defineSlots<{
  default: () => any
  header: () => any
  footer: () => any
  left: () => any
}>()

const layoutStyle = computed(() => {
  const headerLeft = props.headerContainLeft ? 'header' : 'left'
  const headerRight = props.headerContainRight ? 'header' : 'right'
  const footerLeft = props.footerContainLeft ? 'footer' : 'left'
  const footerRight = props.footerContainRight ? 'footer' : 'right'
  return {
    gridTemplateAreas: `
      "${headerLeft} header ${headerRight}"
      "left body right"
      "${footerLeft} footer ${footerRight}"
    `,
  }
})
</script>

<template>
  <div class="base-layout" :style="layoutStyle">
    <div v-if="$slots.header" class="base-layout-header">
      <slot name="header" />
    </div>
    <div v-if="$slots.left" class="base-layout-left">
      <slot name="left" />
    </div>
    <div class="base-layout-container">
      <slot />
    </div>
    <div v-if="$slots.right" class="base-layout-right">
      <slot name="right" />
    </div>
    <div v-if="$slots.footer" class="base-layout-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped lang="less">
.base-layout {
  --base-layout-header-height: 50px;
  --base-layout-left-width: 232px;
  --base-layout-right-width: 232px;
  --base-layout-footer-height: 50px;
}
.base-layout {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto 1fr auto;
  grid-template-areas: "left head right" "left body right" "left foot right";
  height: 100%;
  .base-layout-header {
    grid-area: header;
    height: var(--base-layout-header-height);
  }
  .base-layout-left {
    grid-area: left;
    width: var(--base-layout-left-width);
  }
  .base-layout-container {
    grid-area: body;
  }
  .base-layout-right {
    grid-area: right;
    width: var(--base-layout-right-width);
  }
  .base-layout-footer {
    grid-area: footer;
    height: var(--base-layout-footer-height);
  }
}
</style>
