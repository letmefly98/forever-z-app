<script setup lang="ts">
import type Comp from '@/pages/poster/core/comps/container/index'
import { inject } from 'vue'
import Renderer from '../renderer/index.vue'
import { rendererInjectKey } from '../renderer/inject'

type IComp = typeof Comp

interface Props {
  data: IComp
}
const props = withDefaults(defineProps<Props>(), {})

const { mode } = inject(rendererInjectKey)!
</script>

<template>
  <div class="container" :style="props.data.style">
    <Renderer :layout="props.data.children" :mode="mode" />
  </div>
</template>
