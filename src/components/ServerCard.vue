<template>
  <div
    class="rounded-xl px-4 py-3 relative bg-gray-100"
  >
    <div class="absolute right-4 top-4 group flex flex-col items-end">
      <StatusIndicator
        :status="isOnline(server)"
        class="w-3 h-3"
      />
      <div class="hidden group-hover:block p-2 rounded-xl border text-sm bg-gray-100 z-[9999] mt-1 border-gray-400">
        <div class="flex gap-2">
          <div class="flex items-center gap-1">
            IPv4
            <StatusIndicator
              :status="server.online4"
              class="w-2 h-2"
            />
          </div>
          <div class="flex items-center gap-1">
            IPv6
            <StatusIndicator
              :status="server.online6"
              class="w-2 h-2"
            />
          </div>
        </div>
        <div v-if="server.latest_ts !== undefined">
          最后上报时间<br>
          {{ formatTime(server.latest_ts) }}
        </div>
      </div>
    </div>
    <div class="text-lg flex items-center gap-2">
      <span v-if="isCountryFlagEmoji(server.location)">
        {{ server.location }}
      </span>
      <img
        v-else
        :src="`/image/flags/${server.location.toLowerCase()}.svg`" :alt="`${server.location} flag`"
        class="h-4 inline-block rounded-sm"
      >
      <img
        v-if="labels.os !== undefined"
        :src="`/image/os/${labels.os}.svg`" :alt="`${labels.os} os`"
        class="h-4 inline-block rounded-sm"
      >
      {{ server.alias || server.name }}
    </div>
    <div>
      运行时间
      <span
        :class="{
          'text-red-500': !isOnline(server),
        }"
      >
        {{ isOnline(server) ? server.uptime : '离线' }}
      </span>
    </div>
    <div v-if="!compactMode" class="flex items-center gap-2">
      负载
      <Bandage v-if="noLoadData">
        无数据
      </Bandage>
      <Bandage v-if="server.load !== undefined">
        {{ server.load }}
      </Bandage>
      <Bandage v-if="server.load_1 !== undefined">
        {{ server.load_1 }}
      </Bandage>
      <Bandage v-if="server.load_5 !== undefined">
        {{ server.load_5 }}
      </Bandage>
      <Bandage v-if="server.load_15 !== undefined">
        {{ server.load_15 }}
      </Bandage>
    </div>
    <div v-if="server.cpu !== undefined" class="flex items-center gap-2">
      CPU
      <Progress
        :value="server.cpu" :max="100"
        :text="`${server.cpu}%`"
        class="flex-1"
      >
        {{ server.cpu }}%
      </Progress>
    </div>
    <StatusChart v-if="showCpuChart" :data="cpuHistory" />
    <div v-if="server.memory_total !== undefined" class="flex items-center gap-2">
      内存
      <Progress
        :value="server.memory_used" :max="server.memory_total"
        class="flex-1"
      >
        {{ formatBytes(server.memory_used * 1024) }} / {{ formatBytes(server.memory_total * 1024) }}
      </Progress>
    </div>
    <div v-if="server.hdd_total !== undefined" class="flex items-center gap-2">
      硬盘
      <Progress
        :value="server.hdd_used" :max="server.hdd_total"
        class="flex-1"
      >
        {{ formatBytes(server.hdd_used * 1024 * 1024) }} / {{ formatBytes(server.hdd_total * 1024 * 1024) }}
      </Progress>
    </div>
    <div v-if="server.network_rx !== undefined" class="flex items-center gap-2">
      网络
      <Bandage class="flex items-center">
        <IconDownload class="w-4 h-4" />{{ formatBytes(server.network_rx, 1) }}/s
      </Bandage>
      <Bandage class="flex items-center">
        <IconUpload class="w-4 h-4" />{{ formatBytes(server.network_tx, 1) }}/s
      </Bandage>
    </div>
    <div v-if="server.network_in !== undefined && !compactMode" class="flex items-center gap-2">
      流量
      <Bandage class="flex items-center">
        <IconDownload class="w-4 h-4" />{{ formatBytes(server.network_in, 1) }}
      </Bandage>
      <Bandage class="flex items-center">
        <IconUpload class="w-4 h-4" />{{ formatBytes(server.network_out, 1) }}
      </Bandage>
    </div>
    <div v-if="server.swap_total !== undefined && !compactMode">
      SWAP
      <Bandage>
        {{ formatBytes(server.swap_used * 1024) }} / {{ formatBytes(server.swap_total * 1024) }}
      </Bandage>
    </div>
    <div
      v-if=" !compactMode"
      class="flex gap-1 flex-wrap mt-1"
    >
      <Bandage v-if="server.tcp_count !== undefined">
        TCP {{ server.tcp_count }}
      </Bandage>
      <Bandage v-if="server.udp_count !== undefined">
        UDP {{ server.udp_count }}
      </Bandage>
      <Bandage v-if="server.process_count !== undefined">
        进程 {{ server.process_count }}
      </Bandage>
      <Bandage v-if="server.thread_count !== undefined">
        线程 {{ server.thread_count }}
      </Bandage>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ServerData } from '@/types'
import { formatBytes, formatTime, hasLoadData, isCountryFlagEmoji, isOnline, parseLabels } from '@/utils'

const props = defineProps<{
  server: ServerData
  compactMode: boolean
  showCpuChart: boolean
}>()

const StatusChart = defineAsyncComponent(() => import('@/components/StatusChart.vue'))

const CPU_HISTORY_KEEP_TIME = 300
let cpuHistoryLastUpdated = 0

const cpuHistory = ref<any[]>([])

const labels = computed(() => parseLabels(props.server.labels))
const noLoadData = computed(() => hasLoadData(props.server))

watch(() => props.server, () => {
  if (props.server.latest_ts && props.server.cpu) {
    if (props.server.latest_ts <= cpuHistoryLastUpdated)
      return

    const list = cpuHistory.value.slice()
    list.push({
      name: Date.now(),
      value: [
        props.server.latest_ts * 1000,
        props.server.cpu,
      ],
    })
    while (list[0].name < Date.now() - CPU_HISTORY_KEEP_TIME * 1000)
      list.shift()

    cpuHistory.value = list
    cpuHistoryLastUpdated = props.server.latest_ts
  }
})
</script>
