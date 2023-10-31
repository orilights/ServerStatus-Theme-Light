<template>
  <div class="absolute right-3 sm:right-6 top-4 flex flex-col items-end">
    <button @click="showSettingPanel = !showSettingPanel">
      <IconSettings class="text-gray-500 hover:text-black w-6 h-6 transition-colors" />
    </button>
    <Transition name="popup-right">
      <div
        v-show="showSettingPanel"
        class="border shadow-md rounded-lg px-4 py-3 z-50 bg-white mt-2 min-w-[200px]"
      >
        <h2 class="font-bold text-lg">
          设置
        </h2>
        <div class="flex items-center justify-between">
          布局模式
          <div class="rounded-lg overflow-hidden border h-[30px]">
            <button
              class="p-1 hover:bg-gray-200 text-gray-500 transition-colors"
              :class="{
                '!bg-gray-300 !text-black': settings.layout === 'grid',
              }"
              @click="settings.layout = 'grid'"
            >
              <IconLayoutGrid class="w-5 h-5" />
            </button>
            <button
              class="p-1 hover:bg-gray-200 text-gray-500 transition-colors"
              :class="{
                '!bg-gray-300 !text-black': settings.layout === 'flex',
              }"
              @click="settings.layout = 'flex'"
            >
              <IconLayoutFlex class="w-5 h-5" />
            </button>
            <button
              class="p-1 hover:bg-gray-200 text-gray-500 transition-colors"
              :class="{
                '!bg-gray-300 !text-black': settings.layout === 'list',
              }"
              @click="settings.layout = 'list'"
            >
              <IconLayoutList class="w-5 h-5" />
            </button>
          </div>
        </div>
        <div class="flex items-center justify-between">
          精简显示
          <Switch v-model="settings.compactMode" />
        </div>
      </div>
    </Transition>
  </div>
  <div v-if="loading" class="w-fit mx-auto my-2 rounded-lg bg-gray-100 px-4 py-2">
    加载中
  </div>
  <div v-if="error" class="w-fit mx-auto my-2 rounded-lg bg-gray-100 px-4 py-2">
    数据加载失败，请尝试刷新页面或检查 ServerStatus 服务端状态
  </div>
  <div
    v-if="serverData"
    :class="{
      'grid gap-x-4 gap-y-3': settings.layout === 'grid',
      'flex flex-wrap gap-x-4 gap-y-3': settings.layout === 'flex',
      'flex flex-col gap-y-3': settings.layout === 'list',
    }"
    :style="{
      gridTemplateColumns: `repeat(${serverCardCount}, minmax(0, 1fr))`,
    }"
  >
    <template v-if="settings.layout === 'grid' || settings.layout === 'flex'">
      <ServerCard
        v-for="server, index in serverData.servers" :key="index"
        :server="server"
        :compact-mode="settings.compactMode"
        :class="{
          'col-span-1': settings.layout === 'grid',
          'flex-1 min-w-[300px]': settings.layout === 'flex',
        }"
      />
    </template>
    <template v-if="settings.layout === 'list'">
      <ServerItem
        v-for="server, index in serverData.servers" :key="index"
        :server="server"
        :compact-mode="settings.compactMode"
        class="col-span-1"
      />
    </template>
  </div>
  <div class="h-16" />
</template>

<script setup lang="ts">
import { useLocalStorage, useWindowSize } from '@vueuse/core'
import type { ServerData } from './types'

const jsonApi = '/json/stats.json'

const ServerCardWidth = 350

const { width: WindowWidth } = useWindowSize()

const serverData = ref<{
  updated: number
  servers: ServerData[]
}>()
const loading = ref(true)
const error = ref(false)
const fetching = ref(false)

const settings = useLocalStorage('sstl-settings', {
  layout: 'grid',
  compactMode: false,
}, {
  mergeDefaults: true,
})
const showSettingPanel = ref(false)

const serverCardCount = computed(() => {
  return Math.floor(WindowWidth.value / ServerCardWidth) || 1
})

onMounted(() => {
  fetch(jsonApi)
    .then(res => res.json())
    .then((data) => {
      serverData.value = data
      setInterval(() => {
        fetchData()
      }, 500)
    })
    .catch(() => {
      error.value = true
    })
    .finally(() => {
      loading.value = false
    })
})

function fetchData() {
  if (fetching.value)
    return
  fetching.value = true
  fetch(jsonApi)
    .then(res => res.json())
    .then((data) => {
      serverData.value = data
      error.value = false
    })
    .catch(() => {
      error.value = true
    })
    .finally(() => {
      fetching.value = false
    })
}
</script>

<style>
.popup-right-enter-active,
.popup-right-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.popup-right-enter-from,
.popup-right-leave-to {
  opacity: 0;
  transform: translate(10px, -10px) scale(0.9);
}
</style>
