<template>
  <div class="px-3 sm:px-6 min-h-screen relative">
    <h1 class="text-4xl font-bold py-4">
      服务器监控
    </h1>
    <div v-if="loading" class="w-fit mx-auto my-2">
      加载中
    </div>
    <div v-if="error" class="w-fit mx-auto my-2">
      数据加载失败，请尝试刷新页面或检查 ServerStatus 服务端状态
    </div>
    <div v-if="serverData" class="flex flex-wrap gap-x-4 gap-y-3">
      <ServerItem
        v-for="server in serverData.servers" :key="server.name"
        :server="server"
        class="flex-1 min-w-[300px]"
      />
    </div>
    <div class="h-16" />
    <div class="text-center absolute left-0 bottom-0 py-4 w-full">
      Powered by <a class="text-blue-500" href="https://github.com/zdz/ServerStatus-Rust" target="_blank">ServerStatus-Rust</a>. Theme <a class="text-blue-500" href="https://github.com/orilights/ServerStatus-Theme-Light" target="_blank">Light</a> by <a class="text-blue-500" href="https://orilight.top/" target="_blank">OriLight</a>
    </div>
  </div>
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
