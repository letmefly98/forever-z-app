<script setup lang="ts">
import Left from './left/index.vue'
import Middle from './middle/index.vue'
import Right from './right/index.vue'
</script>

<template>
  <div class="poster-builder">
    <el-container>
      <el-header class="poster-builder-header">
        Header
      </el-header>
      <el-container>
        <el-aside class="poster-builder-left">
          <Left />
        </el-aside>
        <el-main class="poster-builder-middle">
          <Middle />
        </el-main>
        <el-aside class="poster-builder-right">
          <Right />
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="less">
.poster-builder {
  .poster-builder-header {
    --el-header-padding: 0 0;
    --el-header-height: auto;
  }
  .poster-builder-middle {
    --el-main-padding: 0 0;
  }
  .poster-builder-left {
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
