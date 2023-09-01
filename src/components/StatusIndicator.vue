<template>
  <div
    class="rounded-full inline-block"
    :class="{
      'bg-green-400': status,
      'bg-red-500': !status,
    }"
  />
</template>

<script setup lang="ts">
defineProps<{
  status: boolean
}>()
</script>
