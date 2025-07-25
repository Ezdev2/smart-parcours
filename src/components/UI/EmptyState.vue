<template>
    <div class="text-center py-12 flex flex-col items-center gap-8">
        <component :is="icon" class="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
                {{ title }}
            </h3>
            <p class="text-gray-600 mb-4">
                {{ description }}
            </p>
        </div>
        <Button @click="$emit('action')">
            {{ buttonText }}
        </Button>
    </div>
</template>

<script setup>
import Button from './Button.vue'

defineProps({
    icon: {
        type: Object,
        required: true
    },
    title: {
        type: String,
        default: 'Aucun contenu'
    },
    description: {
        type: String,
        default: 'Aucune donnée disponible.'
    },
    buttonText: {
        type: String,
        default: 'Ajouter'
    }
})

defineEmits(['action'])
</script>
