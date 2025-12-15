<template>
  <div class="card bg-gradient-to-br from-base-100 to-base-200 shadow-2xl border border-base-300 hover:shadow-primary/20 transition-all duration-300">
    <div class="card-body">
      <h2 class="card-title text-2xl">
        <span class="text-3xl">📁</span>
        Upload de fichier
      </h2>
      
      <div
        @drop.prevent="handleDrop"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        :class="[
          'border-4 border-dashed rounded-2xl p-16 text-center transition-all duration-300',
          isDragging ? 'border-primary bg-primary/10 scale-105 shadow-xl' : 'border-base-300 hover:border-primary/50',
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
        
        <div v-if="!uploading" class="space-y-6">
          <div class="text-6xl animate-float">💾</div>
          <div>
            <p class="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Glissez-déposez un fichier
            </p>
            <p class="text-sm text-base-content/70 mb-6">ou cliquez pour sélectionner</p>
            <button @click="fileInput?.click()" class="btn btn-primary btn-lg gap-2 shadow-lg hover:scale-105 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Sélectionner
            </button>
          </div>
          <div class="flex flex-wrap gap-2 justify-center mt-6">
            <div class="badge badge-lg badge-outline gap-1">🎬 MP4</div>
            <div class="badge badge-lg badge-outline gap-1">📹 MKV</div>
            <div class="badge badge-lg badge-outline gap-1">🎵 MP3</div>
            <div class="badge badge-lg badge-outline gap-1">🎶 WAV</div>
            <div class="badge badge-lg badge-outline gap-1">✨ Et plus...</div>
          </div>
        </div>
        
        <div v-else class="space-y-6">
          <div class="loading loading-spinner loading-lg text-primary"></div>
          <p class="text-xl font-semibold">Upload en cours...</p>
          <div class="w-full">
            <progress class="progress progress-primary w-full h-4" :value="uploadProgress" max="100"></progress>
            <p class="text-2xl font-bold mt-2 text-primary">{{ uploadProgress }}%</p>
          </div>
        </div>
      </div>
      
      <div v-if="error" class="alert alert-error shadow-lg mt-4">
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
