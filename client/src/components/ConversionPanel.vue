<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">🔄 Conversion</h2>
      
      <div class="tabs tabs-boxed">
        <a 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab', activeTab === tab.id && 'tab-active']"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </a>
      </div>

      <!-- Conversion Simple -->
      <div v-if="activeTab === 'simple'" class="space-y-4 mt-4">
        <div class="form-control">
          <label class="label"><span class="label-text">Format de sortie</span></label>
          <select v-model="simpleOptions.outputFormat" class="select select-bordered">
            <option value="mp4">MP4 (H.264+AAC)</option>
            <option value="webm">WebM (VP9+Opus)</option>
            <option value="mp3">MP3 (Audio uniquement)</option>
          </select>
        </div>

        <button @click="handleSimpleConvert" :disabled="converting" class="btn btn-primary w-full">
          <span v-if="!converting">Convertir</span>
          <span v-else class="loading loading-spinner"></span>
        </button>
      </div>

      <!-- Progression -->
      <div v-if="converting" class="mt-4 space-y-2">
        <progress class="progress progress-primary w-full" :value="conversionProgress" max="100"></progress>
        <p class="text-sm text-center">{{ conversionProgress }}%</p>
      </div>

      <!-- Résultat -->
      <div v-if="result" class="alert alert-success mt-4">
        <div class="flex-1">
          <p>Conversion terminée !</p>
        </div>
        <a :href="downloadUrl" download class="btn btn-sm btn-success">Télécharger</a>
      </div>

      <!-- Erreur -->
      <div v-if="error" class="alert alert-error mt-4">
        <span>{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useConversionStore } from '@/stores/conversion.store';
import { storeToRefs } from 'pinia';
import { ffmpegAPI } from '@/services/ffmpeg.api';
import type { FFmpegMetadata } from '@/services/ffmpeg.api';

defineProps<{
  metadata: FFmpegMetadata | null;
}>();

const conversionStore = useConversionStore();
const { converting, conversionProgress, error, result } = storeToRefs(conversionStore);

const activeTab = ref('simple');

const tabs = [
  { id: 'simple', label: 'Conversion' }
];

const simpleOptions = ref({
  outputFormat: 'mp4'
});

const downloadUrl = computed(() => {
  if (!result.value) return '';
  return ffmpegAPI.getDownloadUrl(result.value.outputPath);
});

async function handleSimpleConvert() {
  await conversionStore.convert({
    outputFormat: simpleOptions.value.outputFormat,
    videoCodec: 'libx264',
    audioCodec: 'aac'
  });
}
</script>
