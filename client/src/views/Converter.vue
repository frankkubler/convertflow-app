<template>
  <div class="max-w-6xl mx-auto">
    <h1 class="text-4xl font-bold mb-8 text-white text-center">🔄 Convertisseur</h1>

    <div class="grid grid-cols-1 gap-6">
      <FileUpload @uploaded="handleFileUploaded" />
      
      <MediaInfo v-if="currentFileMetadata" :metadata="currentFileMetadata" />
      
      <ConversionPanel :fileId="currentFileId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FileUpload from '@/components/FileUpload.vue';
import MediaInfo from '@/components/MediaInfo.vue';
import ConversionPanel from '@/components/ConversionPanel.vue';
import { useMediaStore } from '@/stores/media.store';

const mediaStore = useMediaStore();

const currentFileId = ref<string | null>(null);
const currentFileMetadata = ref<any>(null);

async function handleFileUploaded(file: any) {
  currentFileId.value = file.id;
  currentFileMetadata.value = file.metadata;
}
</script>
