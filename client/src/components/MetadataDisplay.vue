<template>
  <div v-if="metadata" class="card bg-gradient-to-br from-base-100 to-base-200 shadow-2xl border border-base-300">
    <div class="card-body">
      <h2 class="card-title text-2xl mb-4">
        <span class="text-3xl">ℹ️</span>
        Informations du fichier
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Général -->
        <div class="space-y-3">
          <h3 class="font-semibold text-lg flex items-center gap-2">
            <div class="badge badge-primary badge-sm"></div>
            Général
          </h3>
          <div class="bg-base-200/50 rounded-xl p-4 space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm opacity-70">Durée</span>
              <span class="font-bold text-primary">{{ formatDuration(metadata.duration) }}</span>
            </div>
            <div class="divider my-1"></div>
            <div class="flex justify-between items-center">
              <span class="text-sm opacity-70">Format</span>
              <span class="font-mono text-sm badge badge-outline">{{ metadata.format }}</span>
            </div>
            <div class="divider my-1"></div>
            <div class="flex justify-between items-center">
              <span class="text-sm opacity-70">Taille</span>
              <span class="font-bold">{{ formatSize(metadata.size) }}</span>
            </div>
            <div class="divider my-1"></div>
            <div class="flex justify-between items-center">
              <span class="text-sm opacity-70">Bitrate</span>
              <span class="font-bold text-secondary">{{ formatBitrate(metadata.bitrate) }}</span>
            </div>
          </div>
        </div>

        <!-- Vidéo + Audio -->
        <div class="space-y-3">
          <div v-if="metadata.video">
            <h3 class="font-semibold text-lg flex items-center gap-2 mb-3">
              <div class="badge badge-secondary badge-sm"></div>
              Vidéo
            </h3>
            <div class="bg-base-200/50 rounded-xl p-4 space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm opacity-70">Codec</span>
                <span class="font-mono font-bold text-secondary">{{ metadata.video.codec.toUpperCase() }}</span>
              </div>
              <div class="divider my-1"></div>
              <div class="flex justify-between items-center">
                <span class="text-sm opacity-70">Résolution</span>
                <span class="font-bold">{{ metadata.video.width }}x{{ metadata.video.height }}</span>
              </div>
              <div class="divider my-1"></div>
              <div class="flex justify-between items-center">
                <span class="text-sm opacity-70">FPS</span>
                <span class="font-bold">{{ metadata.video.fps.toFixed(2) }}</span>
              </div>
              <div class="divider my-1"></div>
              <div class="flex justify-between items-center">
                <span class="text-sm opacity-70">Bitrate</span>
                <span class="font-bold">{{ formatBitrate(metadata.video.bitrate) }}</span>
              </div>
            </div>
          </div>

          <div v-if="metadata.audio">
            <h3 class="font-semibold text-lg flex items-center gap-2 mb-3 mt-4">
              <div class="badge badge-accent badge-sm"></div>
              Audio
            </h3>
            <div class="bg-base-200/50 rounded-xl p-4 space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm opacity-70">Codec</span>
                <span class="font-mono font-bold text-accent">{{ metadata.audio.codec.toUpperCase() }}</span>
              </div>
              <div class="divider my-1"></div>
              <div class="flex justify-between items-center">
                <span class="text-sm opacity-70">Sample Rate</span>
                <span class="font-bold">{{ metadata.audio.sampleRate }} Hz</span>
              </div>
              <div class="divider my-1"></div>
              <div class="flex justify-between items-center">
                <span class="text-sm opacity-70">Canaux</span>
                <span class="font-bold">{{ metadata.audio.channels }}</span>
              </div>
              <div class="divider my-1"></div>
              <div class="flex justify-between items-center">
                <span class="text-sm opacity-70">Bitrate</span>
                <span class="font-bold">{{ formatBitrate(metadata.audio.bitrate) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FFmpegMetadata } from '@/services/ffmpeg.api';

defineProps<{
  metadata: FFmpegMetadata | null;
}>();

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function formatSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (mb < 1024) {
    return `${mb.toFixed(2)} MB`;
  }
  return `${(mb / 1024).toFixed(2)} GB`;
}

function formatBitrate(bitrate: number): string {
  const kbps = bitrate / 1000;
  if (kbps < 1000) {
    return `${kbps.toFixed(0)} kbps`;
  }
  return `${(kbps / 1000).toFixed(1)} Mbps`;
}
</script>
