<template>
  <div class="flex items-center justify-between">
    {{ title }}
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>
