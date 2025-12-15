<template>
  <div v-if="metadata" class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">ℹ️ Informations du fichier</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Général -->
        <div class="space-y-2">
          <h3 class="font-semibold text-lg">Général</h3>
          <div class="stats stats-vertical shadow">
            <div class="stat">
              <div class="stat-title">Durée</div>
              <div class="stat-value text-2xl">{{ formatDuration(metadata.duration) }}</div>
            </div>
            <div class="stat">
              <div class="stat-title">Format</div>
              <div class="stat-value text-xl">{{ metadata.format }}</div>
            </div>
            <div class="stat">
              <div class="stat-title">Taille</div>
              <div class="stat-value text-xl">{{ formatSize(metadata.size) }}</div>
            </div>
            <div class="stat">
              <div class="stat-title">Bitrate</div>
              <div class="stat-value text-xl">{{ formatBitrate(metadata.bitrate) }}</div>
            </div>
          </div>
        </div>

        <!-- Vidéo -->
        <div class="space-y-2">
          <div v-if="metadata.video">
            <h3 class="font-semibold text-lg">Vidéo</h3>
            <div class="stats stats-vertical shadow">
              <div class="stat">
                <div class="stat-title">Codec</div>
                <div class="stat-value text-2xl">{{ metadata.video.codec.toUpperCase() }}</div>
              </div>
              <div class="stat">
                <div class="stat-title">Résolution</div>
                <div class="stat-value text-xl">{{ metadata.video.width }}x{{ metadata.video.height }}</div>
              </div>
              <div class="stat">
                <div class="stat-title">FPS</div>
                <div class="stat-value text-xl">{{ metadata.video.fps.toFixed(2) }}</div>
              </div>
              <div class="stat">
                <div class="stat-title">Bitrate</div>
                <div class="stat-value text-xl">{{ formatBitrate(metadata.video.bitrate) }}</div>
              </div>
            </div>
          </div>

          <!-- Audio -->
          <div v-if="metadata.audio">
            <h3 class="font-semibold text-lg mt-4">Audio</h3>
            <div class="stats stats-vertical shadow">
              <div class="stat">
                <div class="stat-title">Codec</div>
                <div class="stat-value text-2xl">{{ metadata.audio.codec.toUpperCase() }}</div>
              </div>
              <div class="stat">
                <div class="stat-title">Sample Rate</div>
                <div class="stat-value text-xl">{{ metadata.audio.sampleRate }} Hz</div>
              </div>
              <div class="stat">
                <div class="stat-title">Canaux</div>
                <div class="stat-value text-xl">{{ metadata.audio.channels }}</div>
              </div>
              <div class="stat">
                <div class="stat-title">Bitrate</div>
                <div class="stat-value text-xl">{{ formatBitrate(metadata.audio.bitrate) }}</div>
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
