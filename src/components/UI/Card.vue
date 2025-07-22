<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  padding: {
    type: Boolean,
    default: true
  }
})

const cardClasses = computed(() => {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200'
  const paddingClass = props.padding ? 'p-6' : ''
  return `${baseClasses} ${paddingClass}`
})
</script>