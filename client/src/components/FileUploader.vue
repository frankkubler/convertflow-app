<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">📁 Upload de fichier</h2>
      
      <div
        @drop.prevent="handleDrop"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        :class="[
          'border-4 border-dashed rounded-lg p-12 text-center transition-all',
          isDragging ? 'border-primary bg-primary/10 scale-105' : 'border-base-300',
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
        
        <div v-if="!uploading" class="space-y-4">
          <svg class="w-16 h-16 mx-auto text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <div>
            <p class="text-lg font-semibold mb-2">Glissez-déposez un fichier ici</p>
            <p class="text-sm text-base-content/70 mb-4">ou</p>
            <button @click="fileInput?.click()" class="btn btn-primary">
              Sélectionner un fichier
            </button>
          </div>
          <p class="text-xs text-base-content/50 mt-4">
            Formats supportés : Tous les formats vidéo/audio (MP4, MKV, AVI, MOV, MP3, WAV, FLAC, etc.)
          </p>
        </div>
        
        <div v-else class="space-y-4">
          <span class="loading loading-spinner loading-lg text-primary"></span>
          <p class="text-lg font-semibold">Upload en cours...</p>
          <progress class="progress progress-primary w-full" :value="uploadProgress" max="100"></progress>
          <p class="text-sm">{{ uploadProgress }}%</p>
        </div>
      </div>
      
      <div v-if="error" class="alert alert-error mt-4">
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
