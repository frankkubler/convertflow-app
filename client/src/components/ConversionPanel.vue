<template>
  <div class="card bg-gradient-to-br from-base-100 to-base-200 shadow-2xl border border-base-300">
    <div class="card-body">
      <h2 class="card-title text-2xl mb-4">
        <span class="text-3xl">🔄</span>
        Conversion
      </h2>
      
      <div class="space-y-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Format de sortie</span>
          </label>
          <select v-model="simpleOptions.outputFormat" class="select select-bordered select-primary w-full">
            <option value="mp4">🎬 MP4 (H.264 + AAC)</option>
            <option value="webm">🌐 WebM (VP9 + Opus)</option>
            <option value="mp3">🎵 MP3 (Audio uniquement)</option>
            <option value="wav">🎶 WAV (Audio haute qualité)</option>
          </select>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Qualité</span>
          </label>
          <div class="join w-full">
            <button 
              class="btn join-item flex-1" 
              :class="simpleOptions.quality === 'high' ? 'btn-primary' : 'btn-outline'"
              @click="simpleOptions.quality = 'high'"
            >
              🔥 Haute
            </button>
            <button 
              class="btn join-item flex-1" 
              :class="simpleOptions.quality === 'medium' ? 'btn-primary' : 'btn-outline'"
              @click="simpleOptions.quality = 'medium'"
            >
              ⭐ Moyenne
            </button>
            <button 
              class="btn join-item flex-1" 
              :class="simpleOptions.quality === 'low' ? 'btn-primary' : 'btn-outline'"
              @click="simpleOptions.quality = 'low'"
            >
              📦 Basse
            </button>
          </div>
          <label class="label">
            <span class="label-text-alt text-xs opacity-70">
              {{ qualityDescription }}
            </span>
          </label>
        </div>

        <button 
          @click="handleSimpleConvert" 
          :disabled="converting" 
          class="btn btn-primary btn-lg w-full gap-2 shadow-lg hover:scale-105 transition-transform"
        >
          <svg v-if="!converting" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span v-if="!converting">Lancer la conversion</span>
          <span v-else class="loading loading-spinner"></span>
        </button>
      </div>

      <!-- Progression -->
      <div v-if="converting" class="mt-6 space-y-3 p-4 bg-primary/10 rounded-xl border border-primary/20">
        <div class="flex justify-between items-center">
          <span class="font-semibold">Conversion en cours...</span>
          <span class="text-2xl font-bold text-primary">{{ conversionProgress }}%</span>
        </div>
        <progress class="progress progress-primary w-full h-3" :value="conversionProgress" max="100"></progress>
      </div>

      <!-- Résultat -->
      <div v-if="result" class="alert alert-success shadow-lg mt-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="flex-1">
          <h3 class="font-bold">Conversion terminée !</h3>
          <p class="text-sm">{{ result.filename }}</p>
        </div>
        <a :href="downloadUrl" download class="btn btn-success gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Télécharger
        </a>
      </div>

      <!-- Erreur -->
      <div v-if="error" class="alert alert-error shadow-lg mt-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
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

const simpleOptions = ref({
  outputFormat: 'mp4',
  quality: 'medium'
});

const qualityDescription = computed(() => {
  const descriptions = {
    high: 'Bitrate élevé (5 Mbps vidéo, 256 kbps audio) - Meilleure qualité',
    medium: 'Bitrate moyen (2 Mbps vidéo, 192 kbps audio) - Recommandé',
    low: 'Bitrate faible (1 Mbps vidéo, 128 kbps audio) - Fichier plus petit'
  };
  return descriptions[simpleOptions.value.quality as keyof typeof descriptions];
});

const downloadUrl = computed(() => {
  if (!result.value) return '';
  return ffmpegAPI.getDownloadUrl(result.value.outputPath);
});

async function handleSimpleConvert() {
  const qualitySettings = {
    high: { videoBitrate: '5M', audioBitrate: '256k' },
    medium: { videoBitrate: '2M', audioBitrate: '192k' },
    low: { videoBitrate: '1M', audioBitrate: '128k' }
  };

  const settings = qualitySettings[simpleOptions.value.quality as keyof typeof qualitySettings];
  const isAudioOnly = ['mp3', 'wav'].includes(simpleOptions.value.outputFormat);

  await conversionStore.convert({
    outputFormat: simpleOptions.value.outputFormat,
    videoCodec: isAudioOnly ? undefined : 'libx264',
    audioCodec: 'aac',
    ...settings
  });
}
</script>
