<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const msg = ref<string>('')
const logs = ref<string[]>([])

onMounted(() => {
  window.electron.onMessageFromWeb('main-message', res => logs.value.push(res))
})
onUnmounted(() => {
  window.electron.offMessageFromWeb('main-message')
})

async function handleSendToOtherWeb() {
  window.electron.sendToOtherWeb('map-message', msg.value)
}
</script>

<template>
  <h1>Map Editor</h1>
  <el-input v-model="msg" />
  <el-button @click="handleSendToOtherWeb">
    发给其他页面
  </el-button>
  <template v-for="(item, index) in logs" :key="index">
    <p>{{ item }}</p>
  </template>
</template>
