<template>
  <div class="card bg-base-100 shadow-lg border border-base-300">
    <div class="card-body">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-semibold">
          Conversion
        </h2>
        <div class="badge badge-primary gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Rapide
        </div>
      </div>
      
      <div class="space-y-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Format de sortie</span>
            <span class="label-text-alt text-xs">30+ formats</span>
          </label>
          <select v-model="simpleOptions.outputFormat" class="select select-bordered w-full">
            <optgroup label="Vidéo">
              <option value="mp4">MP4 (H.264 + AAC)</option>
              <option value="webm">WebM (VP9 + Opus)</option>
              <option value="mkv">MKV (Matroska)</option>
              <option value="avi">AVI</option>
              <option value="mov">MOV (QuickTime)</option>
              <option value="flv">FLV</option>
              <option value="wmv">WMV</option>
              <option value="m4v">M4V</option>
              <option value="av1.mp4">AV1 en MP4</option>
              <option value="h264.mp4">H.264 en MP4</option>
              <option value="h265.mp4">H.265 (HEVC) en MP4</option>
            </optgroup>
            <optgroup label="Audio">
              <option value="mp3">MP3</option>
              <option value="aac">AAC</option>
              <option value="opus">Opus</option>
              <option value="wav">WAV</option>
              <option value="flac">FLAC</option>
              <option value="ogg">OGG Vorbis</option>
              <option value="m4a">M4A</option>
            </optgroup>
            <optgroup label="Image/GIF">
              <option value="gif">GIF animé</option>
              <option value="apng">APNG</option>
              <option value="webp">WebP</option>
              <option value="ico">ICO</option>
            </optgroup>
          </select>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Qualité d'encodage</span>
          </label>
          <div class="join w-full">
            <button 
              class="btn join-item flex-1" 
              :class="simpleOptions.quality === 'high' ? 'btn-primary' : 'btn-outline'"
              @click="simpleOptions.quality = 'high'"
            >
              Haute
            </button>
            <button 
              class="btn join-item flex-1" 
              :class="simpleOptions.quality === 'medium' ? 'btn-primary' : 'btn-outline'"
              @click="simpleOptions.quality = 'medium'"
            >
              Moyenne
            </button>
            <button 
              class="btn join-item flex-1" 
              :class="simpleOptions.quality === 'low' ? 'btn-primary' : 'btn-outline'"
              @click="simpleOptions.quality = 'low'"
            >
              Basse
            </button>
          </div>
          <label class="label">
            <span class="label-text-alt text-xs">
              {{ qualityDescription }}
            </span>
          </label>
        </div>

        <button 
          @click="handleSimpleConvert" 
          :disabled="converting" 
          class="btn btn-primary btn-lg w-full gap-2"
        >
          <svg v-if="!converting" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span v-if="!converting">Lancer la conversion</span>
          <span v-else class="loading loading-spinner"></span>
        </button>
      </div>

      <!-- Progression -->
      <div v-if="converting" class="mt-6 space-y-3 p-4 bg-base-200 rounded-lg border border-base-300">
        <div class="flex justify-between items-center">
          <span class="font-medium flex items-center gap-2">
            <span class="loading loading-spinner loading-sm"></span>
            Conversion en cours...
          </span>
          <span class="text-xl font-semibold text-primary">{{ conversionProgress }}%</span>
        </div>
        <div class="w-full bg-base-300 rounded-full h-3 overflow-hidden">
          <div 
            class="bg-primary h-full transition-all duration-300"
            :style="{ width: `${conversionProgress}%` }"
          ></div>
        </div>
      </div>

      <!-- Résultat -->
      <div v-if="result" class="alert alert-success mt-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="flex-1">
          <h3 class="font-semibold">Conversion terminée</h3>
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
import { ref, computed, watch } from 'vue';
import { useConversionStore } from '@/stores/conversion.store';
import { storeToRefs } from 'pinia';
import { ffmpegAPI } from '@/services/ffmpeg.api';
import type { FFmpegMetadata } from '@/services/ffmpeg.api';

defineProps<{
  metadata: FFmpegMetadata | null;
}>();

const conversionStore = useConversionStore();
const { converting, conversionProgress, error, result } = storeToRefs(conversionStore);

// Debug: watch pour vérifier la réactivité
watch(conversionProgress, (newVal, oldVal) => {
  console.log('[Component] conversionProgress changed:', oldVal, '->', newVal);
});

watch(converting, (newVal) => {
  console.log('[Component] converting changed:', newVal);
});

const simpleOptions = ref({
  outputFormat: 'mp4',
  quality: 'medium'
});

const qualityDescription = computed(() => {
  const audioOnlyFormats = ['mp3', 'aac', 'opus', 'wav', 'flac', 'ogg', 'm4a'];
  const isAudioOnly = audioOnlyFormats.includes(simpleOptions.value.outputFormat);
  
  const descriptions = {
    high: isAudioOnly 
      ? 'Bitrate audio élevé (320 kbps) - Meilleure qualité'
      : 'Bitrate élevé (5 Mbps vidéo, 256 kbps audio) - Meilleure qualité',
    medium: isAudioOnly
      ? 'Bitrate audio moyen (192 kbps) - Recommandé'
      : 'Bitrate moyen (2 Mbps vidéo, 192 kbps audio) - Recommandé',
    low: isAudioOnly
      ? 'Bitrate audio faible (128 kbps) - Fichier plus petit'
      : 'Bitrate faible (1 Mbps vidéo, 128 kbps audio) - Fichier plus petit'
  };
  return descriptions[simpleOptions.value.quality as keyof typeof descriptions];
});

const downloadUrl = computed(() => {
  if (!result.value) return '';
  return ffmpegAPI.getDownloadUrl(result.value.outputPath);
});

async function handleSimpleConvert() {
  const qualitySettings = {
    high: { videoBitrate: '5M', audioBitrate: '320k' },
    medium: { videoBitrate: '2M', audioBitrate: '192k' },
    low: { videoBitrate: '1M', audioBitrate: '128k' }
  };

  const settings = qualitySettings[simpleOptions.value.quality as keyof typeof qualitySettings];
  
  // Détection des formats audio-only
  const audioOnlyFormats = ['mp3', 'aac', 'opus', 'wav', 'flac', 'ogg', 'm4a'];
  const isAudioOnly = audioOnlyFormats.includes(simpleOptions.value.outputFormat);

  // Utiliser convertAsync pour avoir la progression en temps réel
  await conversionStore.convertAsync({
    outputFormat: simpleOptions.value.outputFormat,
    videoCodec: isAudioOnly ? undefined : 'libx264',
    audioCodec: isAudioOnly ? 'libmp3lame' : 'aac',
    ...settings
  });
}
</script>
