<template>
  <div v-if="loading" class="w-fit mx-auto my-2">
    加载中
  </div>
  <div v-if="error" class="w-fit mx-auto my-2">
    数据加载失败，请尝试刷新页面或检查 ServerStatus 服务端状态
  </div>
  <div v-if="serverData" class="flex flex-wrap gap-x-4 gap-y-3">
    <ServerItem
      v-for="server, index in serverData.servers" :key="index"
      :server="server"
      class="flex-1 min-w-[300px]"
    />
  </div>
  <div class="h-16" />
</template>

<script setup lang="ts">
import type { ServerData } from './types'

const jsonApi = '/json/stats.json'

const serverData = ref<{
  updated: number
  servers: ServerData[]
}>()
const loading = ref(true)
const error = ref(false)

onMounted(() => {
  fetch(jsonApi)
    .then(res => res.json())
    .then((data) => {
      serverData.value = data
      setInterval(() => {
        fetchData()
      }, 1000)
    })
    .catch(() => {
      error.value = true
    })
    .finally(() => {
      loading.value = false
    })
})

function fetchData() {
  fetch(jsonApi)
    .then(res => res.json())
    .then((data) => {
      serverData.value = data
      error.value = false
    })
    .catch(() => {
      error.value = true
    })
}
</script>
