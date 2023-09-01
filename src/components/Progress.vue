<template>
  <div
    class="inline-block text-sm bg-gray-200 rounded-full overflow-hidden relative"
  >
    <div
      class="px-2 text-sm transition-[width] duration-500 whitespace-nowrap"
      :class="{
        'bg-gray-400/50': value / max < 0.8,
        'bg-orange-300': value / max >= 0.8 && value / max < 0.9,
        'bg-red-300': value / max >= 0.9,
      }"
      :style="{
        width: `${value / max * 100}%`,
      }"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  value: number
  max: number
}>()
</script>
