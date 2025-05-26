<script setup lang="ts">
import type TextComp from '@/pages/poster/core/comps/text/index'

defineOptions({
  name: 'ZText',
})

const props = withDefaults(defineProps<Props>(), {})

type ITextComp = typeof TextComp

interface Props {
  data: ITextComp
}
</script>

<template>
  <div :style="props.data.style">
    <span>{{ props.data.props.content }}</span>
  </div>
</template>
