<script setup lang="ts">
import type { CompItem } from '@/pages/poster/core/types/comps'
import type { Component } from 'vue'
import { provide } from 'vue'
import EditBox from './edit-box.vue'
import { rendererInjectKey } from './inject'

interface Props {
  layout: CompItem[]
  mode: 'edit' | 'preview'
}
const props = withDefaults(defineProps<Props>(), {})

provide(rendererInjectKey, {
  mode: props.mode,
})

const modules = import.meta.glob('../comp/*.vue', { import: 'default', eager: true })
const Comps = Object.keys(modules).reduce((re, key) => {
  const module = modules[key] as any
  if (!module) return re
  return ({ ...re, [module.__name]: module })
}, {} as { [key: string]: Component })
</script>

<template>
  <template v-for="item in props.layout" :key="item.id">
    <template v-if="props.mode === 'edit'">
      <EditBox :data="item">
        <component :is="Comps[item.type]" :data="item" />
      </EditBox>
    </template>
    <template v-else>
      <component :is="Comps[item.type]" :data="item" />
    </template>
  </template>
</template>
