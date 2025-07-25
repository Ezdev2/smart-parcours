<template>
  <div :class="cardClasses" :style="isHovering ? { backdropFilter: 'blur(20px)' } : {}">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  padding: {
    type: Boolean,
    default: true
  },
  isHovering: {
    type: Boolean,
    default: false
  }
})

const cardClasses = computed(() => {
  const baseClasses = 'bg-white rounded-2xl p-6'
  const hoveringClass = props.isHovering ? 'cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl' : 'border border-gray-100'
  const paddingClass = props.padding ? 'p-6' : ''
  return `${baseClasses} ${paddingClass} ${hoveringClass}`
})
</script>