<script setup lang="ts">
import type Comp from '@/pages/poster/core/comps/image/index'

type IComp = typeof Comp

interface Props {
  data: IComp
}
const props = withDefaults(defineProps<Props>(), {})
</script>

<template>
  <div :style="props.data.style">
    <img :src="props.data.props.src" />
  </div>
</template>
