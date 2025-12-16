<template>
  <div class="card bg-base-100 shadow-lg border border-base-300">
    <div class="card-body">
      <h2 class="text-2xl font-semibold mb-4">
        Upload de fichier
      </h2>
      
      <div
        @drop.prevent="handleDrop"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        :class="[
          'border-2 border-dashed rounded-lg p-16 text-center transition-colors',
          isDragging ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-base-400 bg-base-200/50',
          uploading ? 'opacity-50 pointer-events-none' : ''
        ]"
      >
        
        <input
          ref="fileInput"
          type="file"
          @change="handleFileSelect"
          accept="video/*,audio/*"
          class="hidden"
          :disabled="uploading"
        />
        
        <div v-if="!uploading" class="space-y-6 relative z-10">
          <svg class="w-16 h-16 mx-auto text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <div>
            <p class="text-xl font-semibold mb-2">
              {{ isDragging ? 'Déposez votre fichier ici' : 'Glissez-déposez un fichier' }}
            </p>
            <p class="text-sm text-base-content/60 mb-6">ou cliquez sur le bouton ci-dessous</p>
            <button @click="fileInput?.click()" class="btn btn-primary gap-2 px-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Parcourir les fichiers
            </button>
          </div>
          <div class="bg-base-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p class="text-xs font-medium text-base-content/70 mb-2">Formats supportés :</p>
            <div class="flex flex-wrap gap-2 justify-center text-xs">
              <span class="badge badge-sm">MP4</span>
              <span class="badge badge-sm">WebM</span>
              <span class="badge badge-sm">MKV</span>
              <span class="badge badge-sm">MP3</span>
              <span class="badge badge-sm">WAV</span>
              <span class="badge badge-sm">+25 formats</span>
            </div>
          </div>
        </div>
        
        <div v-else class="space-y-6 relative z-10">
          <div class="loading loading-spinner loading-lg text-primary"></div>
          <p class="text-lg font-semibold">Upload en cours...</p>
          <div class="w-full max-w-md mx-auto space-y-2">
            <div class="relative">
              <progress class="progress progress-primary w-full h-4" :value="uploadProgress" max="100"></progress>
            </div>
            <p class="text-2xl font-bold text-primary">
              {{ uploadProgress }}%
            </p>
          </div>
        </div>
      </div>
      
      <div v-if="error" class="alert alert-error mt-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useConversionStore } from '@/stores/conversion.store';
import { storeToRefs } from 'pinia';

const conversionStore = useConversionStore();
const { uploading, uploadProgress, error } = storeToRefs(conversionStore);

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);

const emit = defineEmits(['uploaded']);

async function uploadFile(file: File) {
  try {
    const response = await conversionStore.uploadFile(file);
    emit('uploaded', response);
  } catch (err) {
    console.error('Upload error:', err);
  }
}

function handleDrop(e: DragEvent) {
  isDragging.value = false;
  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    uploadFile(files[0]);
  }
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    uploadFile(files[0]);
  }
}
</script>
