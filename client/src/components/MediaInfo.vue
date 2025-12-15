<template>
  <div v-if="metadata" class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">ℹ️ Informations du fichier</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 class="font-semibold mb-2">Général</h3>
          <div class="space-y-1 text-sm">
            <p><span class="font-medium">Durée:</span> {{ formatDuration(metadata.duration) }}</p>
            <p v-if="metadata.tags?.title"><span class="font-medium">Titre:</span> {{ metadata.tags.title }}</p>
            <p v-if="metadata.tags?.artist"><span class="font-medium">Artiste:</span> {{ metadata.tags.artist }}</p>
          </div>
        </div>
        
        <div v-if="metadata.video">
          <h3 class="font-semibold mb-2">Vidéo</h3>
          <div class="space-y-1 text-sm">
            <p><span class="font-medium">Codec:</span> {{ metadata.video.codec }}</p>
            <p><span class="font-medium">Résolution:</span> {{ metadata.video.width }}x{{ metadata.video.height }}</p>
            <p><span class="font-medium">FPS:</span> {{ metadata.video.frameRate }}</p>
            <p v-if="metadata.video.rotation"><span class="font-medium">Rotation:</span> {{ metadata.video.rotation }}°</p>
          </div>
        </div>
        
        <div v-if="metadata.audio">
          <h3 class="font-semibold mb-2">Audio</h3>
          <div class="space-y-1 text-sm">
            <p><span class="font-medium">Codec:</span> {{ metadata.audio.codec }}</p>
            <p><span class="font-medium">Sample Rate:</span> {{ metadata.audio.sampleRate }} Hz</p>
            <p><span class="font-medium">Canaux:</span> {{ metadata.audio.channels }}</p>
            <p v-if="metadata.audio.bitrate"><span class="font-medium">Bitrate:</span> {{ formatBitrate(metadata.audio.bitrate) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  metadata: any
}>();

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function formatBitrate(bitrate: number): string {
  return `${Math.round(bitrate / 1000)} kbps`;
}
</script>
