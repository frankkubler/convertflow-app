<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">📁 Upload de fichier</h2>
      
      <div
        @drop.prevent="handleDrop"
        @dragover.prevent="dragOver = true"
        @dragleave="dragOver = false"
        :class="['border-4 border-dashed rounded-lg p-12 text-center transition-colors', 
                 dragOver ? 'border-primary bg-primary/10' : 'border-base-300']"
      >
        <input
          ref="fileInput"
          type="file"
          @change="handleFileSelect"
          accept="video/*,audio/*"
          class="hidden"
        />
        
        <div v-if="!uploading">
          <svg class="w-16 h-16 mx-auto mb-4 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p class="text-lg mb-2">Glissez-déposez un fichier ici</p>
          <p class="text-sm text-base-content/70 mb-4">ou</p>
          <button @click="$refs.fileInput.click()" class="btn btn-primary">
            Sélectionner un fichier
          </button>
          <p class="text-xs text-base-content/50 mt-4">
            Formats supportés: MP4, WebM, MOV, MKV, MP3, WAV, OGG, FLAC
          </p>
        </div>
        
        <div v-else class="flex flex-col items-center gap-4">
          <span class="loading loading-spinner loading-lg"></span>
          <p>Upload en cours...</p>
        </div>
      </div>
      
      <div v-if="error" class="alert alert-error mt-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ error }}</span>
      </div>
      
      <div v-if="uploadedFile" class="alert alert-success mt-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Fichier uploadé: {{ uploadedFile.originalName }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMediaStore } from '@/stores/media.store';

const mediaStore = useMediaStore();

const dragOver = ref(false);
const uploading = ref(false);
const error = ref<string | null>(null);
const uploadedFile = ref<any>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const emit = defineEmits(['uploaded']);

async function uploadFile(file: File) {
  if (!file) return;
  
  uploading.value = true;
  error.value = null;
  uploadedFile.value = null;
  
  try {
    const result = await mediaStore.uploadFile(file);
    uploadedFile.value = result;
    emit('uploaded', result);
  } catch (err: any) {
    error.value = err.message;
  } finally {
    uploading.value = false;
    dragOver.value = false;
  }
}

function handleDrop(e: DragEvent) {
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
