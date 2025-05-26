<script setup lang="ts">
import type { Theme } from '@/constants/theme'
import { changeTheme, initialTheme } from '@/constants/theme'
import { onMounted, onUnmounted, ref } from 'vue'

const theme = ref<Theme>(initialTheme)
const version = ref<string>('')
const msg = ref<string>('')
const logs = ref<string[]>([])
const logs2 = ref<string[]>([])

onMounted(() => {
  changeTheme(theme.value)
  window.electron.onMessageFromWeb('map-message', res => logs.value.push(res))
  window.electron.onMessageFromApp('timer', res => logs2.value.push(res))
})
onUnmounted(() => {
  window.electron.offMessageFromWeb('map-message')
  window.electron.offMessageFromApp('timer')
})

function toggleTheme() {
  if (theme.value === 'light') theme.value = 'dark'
  else theme.value = 'light'

  changeTheme(theme.value)
}

async function handleGetVersion() {
  const res = await window.electron.sendToApp('getVersion')
  version.value = res
}

async function handleSendToOtherWeb() {
  window.electron.sendToOtherWeb('main-message', msg.value)
}
</script>

<template>
  <div>hello</div>
  <el-button @click="toggleTheme">
    {{ theme }}
  </el-button>
  <el-button @click="handleGetVersion">
    获取版本号 {{ version }}
  </el-button>
  <hr />
  <el-input v-model="msg" />
  <el-button @click="handleSendToOtherWeb">
    发给其他页面
  </el-button>
  <template v-for="(item, index) in logs" :key="index">
    <p>{{ item }}</p>
  </template>
  <hr />
  <template v-for="(item, index) in logs2" :key="index">
    <p>{{ item }}</p>
  </template>
</template>
