<template>
  <div>
    <HeroSection @add-school="openAddSchoolModal" />
    <ServicesSection id="services" />
    <DemoSection id="demo" @add-school="openAddSchoolModal" />
    <DemoRecoveryButton />
    <VideoDemoSection id="video-demo" />
    <WhySmartParcoursSection id="why-smart-parcours" @add-school="openAddSchoolModal" />
    <HowItWorksSection id="how-it-works" />
    <PricingSection id="pricing" @add-school="openAddSchoolModal" /> 
    <AddSchoolFormModal v-if="showAddSchoolModal" @close="showAddSchoolModal = false" @submit-success="handleSchoolAdded" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

import HeroSection from './components/HeroSection.vue';
import DemoSection from './components/DemoSection.vue';
import VideoDemoSection from './components/VideoDemoSection.vue';
import ServicesSection from './components/ServicesSection.vue';
import WhySmartParcoursSection from './components/WhySmartParcoursSection.vue';
import HowItWorksSection from './components/HowItWorksSection.vue';
import PricingSection from './components/PricingSection.vue';
import AddSchoolFormModal from './components/AddSchoolFormModal.vue';
import DemoRecoveryButton from '../Demo/DemoRecoveryButton.vue';
import { useConfirm } from '@/composables/useConfirm';

const showAddSchoolModal = ref(false);
const { showAlert } = useConfirm(); // Use showAlert for feedback

const openAddSchoolModal = () => {
  showAddSchoolModal.value = true;
};

const handleSchoolAdded = (formData) => {
  showAddSchoolModal.value = false;
  // In a real app, send this formData to your backend for manual review/processing
  console.log("Demande d'inscription reçue:", formData);
  showAlert('Demande envoyée !', `Merci ${formData.adminFirstName} ! Votre demande d'inscription pour "${formData.schoolName}" a bien été reçue. Nous vous contacterons bientôt à l'adresse ${formData.adminEmail}.`, 'Ok');
};
</script>

<style scoped>
/* No specific styles here, sections handle their own styling */
</style>