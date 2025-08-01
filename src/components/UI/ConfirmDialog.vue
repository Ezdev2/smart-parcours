<template>
  <transition name="fade">
    <div v-if="confirmState.isVisible" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-2xl overflow-hidden max-w-sm w-full transition-all duration-300 transform scale-95 opacity-0"
           :class="confirmState.isVisible ? 'scale-100 opacity-100' : ''">
        <div class="p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-3" :class="confirmState.isAlert ? 'text-indigo-600' : 'text-red-600'">
            {{ confirmState.title }}
          </h3>
          <p class="text-gray-700 mb-6">{{ confirmState.message }}</p>

          <div class="flex justify-end space-x-3">
            <Button v-if="!confirmState.isAlert" 
                    variant="outline" 
                    @click="cancelAction" 
                    class="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {{ confirmState.cancelText }}
            </Button>
            <Button :variant="confirmState.isAlert ? 'primary' : 'danger'" 
                    @click="confirmAction"
                    :class="confirmState.isAlert ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-red-600 hover:bg-red-700'"
            >
              {{ confirmState.confirmText }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import Button from './Button.vue'; 
import { useConfirm } from '../../composables/useConfirm';

const { confirmState, confirmAction, cancelAction } = useConfirm();
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>