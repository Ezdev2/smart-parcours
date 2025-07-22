<template>
    <div class="w-full flex justify-between mb-8">
      <div class="">
        <h1 v-if="title" class="text-2xl font-bold text-gray-900">
          {{ title }}
        </h1>
        <h1 v-else class="text-2xl font-bold text-gray-900">
          Bonjour {{ user?.profile.firstName }} !
        </h1>
        <p class="text-gray-600">
          {{ description }}
        </p>
      </div>
      <Button v-if="hasButton" @click="$emit('onClick')" :disabled="loading">
        <span v-if="hasIcon"><slot></slot></span>
        <span>{{ loading ? 'Génération...' : btnText }}</span>
      </Button>
    </div>
</template>
<script setup>
import Button from '../../components/UI/Button.vue'

const props = defineProps({
    user: {
        type: Object,
        default: {}
    },
    title: {
        type: String, 
        default: ''
    },
    loading: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        default: 'Here is the description'
    },
    btnText: {
        type: String, 
        default: 'Exemple'
    },
    hasButton: {
        type: Boolean,
        default: false
    },
    hasIcon: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['onClick']);

</script>