<script setup lang="ts">
import usePosterBuilderStore from '../biz/stores/index.store'

const store = usePosterBuilderStore()
</script>

<template>
  <div class="right">
    {{ store.current.id }}
  </div>
</template>
