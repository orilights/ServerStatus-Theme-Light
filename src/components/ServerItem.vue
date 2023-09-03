<template>
  <div
    class="rounded-xl px-4 py-3 transition-all relative bg-gray-100 border border-transparent hover:border-gray-400 hover:shadow-md hover:bg-white duration-300"
  >
    <div class="absolute right-4 top-4 group flex flex-col items-end">
      <StatusIndicator
        :status="isOnline(server)"
        class="w-3 h-3"
      />
      <div class="hidden group-hover:block p-2 rounded-xl border text-sm bg-white z-[9999] mt-1 border-gray-400">
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
        <div v-if="server.latest_ts">
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
        :src="`/image/flags/${server.location}.svg`" :alt="`${server.location} flag`"
        class="h-4 inline-block rounded-sm"
      >
      <img
        v-if="labels.os"
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
    <div class="flex items-center gap-2">
      负载
      <Bandage>{{ server.load_1 }}</Bandage>
      <Bandage>{{ server.load_5 }}</Bandage>
      <Bandage>{{ server.load_15 }}</Bandage>
    </div>
    <div class="flex items-center gap-2">
      CPU
      <Progress
        :value="server.cpu" :max="100"
        :text="`${server.cpu}%`"
        class="flex-1"
      >
        {{ server.cpu }}%
      </Progress>
    </div>
    <div class="flex items-center gap-2">
      内存
      <Progress
        :value="server.memory_used" :max="server.memory_total"
        class="flex-1"
      >
        {{ formatBytes(server.memory_used * 1024) }} / {{ formatBytes(server.memory_total * 1024) }}
      </Progress>
    </div>
    <div class="flex items-center gap-2">
      硬盘
      <Progress
        :value="server.hdd_used" :max="server.hdd_total"
        class="flex-1"
      >
        {{ formatBytes(server.hdd_used * 1024 * 1024) }} / {{ formatBytes(server.hdd_total * 1024 * 1024) }}
      </Progress>
    </div>
    <div class="flex items-center gap-2">
      网络
      <Bandage class="flex items-center">
        <IconDownload class="w-4 h-4" />{{ formatBytes(server.network_rx, 1) }}/s
      </Bandage>
      <Bandage class="flex items-center">
        <IconUpload class="w-4 h-4" />{{ formatBytes(server.network_tx, 1) }}/s
      </Bandage>
    </div>
    <div class="flex items-center gap-2">
      流量
      <Bandage class="flex items-center">
        <IconDownload class="w-4 h-4" />{{ formatBytes(server.network_in, 1) }}
      </Bandage>
      <Bandage class="flex items-center">
        <IconUpload class="w-4 h-4" />{{ formatBytes(server.network_out, 1) }}
      </Bandage>
    </div>
    <div>
      SWAP
      <Bandage>
        {{ formatBytes(server.swap_used * 1024) }} / {{ formatBytes(server.swap_total * 1024) }}
      </Bandage>
    </div>
    <div class="flex gap-1 flex-wrap mt-1">
      <Bandage>
        TCP {{ server.tcp_count }}
      </Bandage>
      <Bandage>
        UDP {{ server.udp_count }}
      </Bandage>
      <Bandage>
        进程 {{ server.process_count }}
      </Bandage>
      <Bandage>
        线程 {{ server.thread_count }}
      </Bandage>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ServerData } from '@/types'
import { formatBytes, formatTime, isCountryFlagEmoji, isOnline } from '@/utils'

const props = defineProps<{
  server: ServerData
}>()

const labels = computed(() => {
  if (!props.server.labels)
    return {}
  const list = props.server.labels.split(';')
  const result: { [key: string]: string } = {}
  list.forEach((item) => {
    if (item === '')
      return
    const [key, value] = item.split('=')
    result[key] = value
  })
  return result
})
</script>
