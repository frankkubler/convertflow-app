<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">🔄 Options de conversion</h2>
      
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">Format de sortie</span>
        </label>
        <select v-model="outputFormat" class="select select-bordered">
          <option value="mp4">MP4</option>
          <option value="webm">WebM</option>
          <option value="mp3">MP3</option>
          <option value="wav">WAV</option>
        </select>
      </div>
      
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">Type d'opération</span>
        </label>
        <select v-model="operationType" class="select select-bordered">
          <option value="convert">Conversion simple</option>
          <option value="extract-audio">Extraire l'audio</option>
          <option value="trim">Découper</option>
          <option value="resize">Redimensionner (vidéo)</option>
        </select>
      </div>
      
      <div v-if="operationType === 'trim'" class="space-y-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Début (secondes)</span>
          </label>
          <input v-model.number="startTime" type="number" min="0" class="input input-bordered" />
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">Fin (secondes)</span>
          </label>
          <input v-model.number="endTime" type="number" min="0" class="input input-bordered" />
        </div>
      </div>
      
      <div v-if="operationType === 'resize'" class="grid grid-cols-2 gap-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Largeur</span>
          </label>
          <input v-model.number="width" type="number" min="1" class="input input-bordered" />
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">Hauteur</span>
          </label>
          <input v-model.number="height" type="number" min="1" class="input input-bordered" />
        </div>
      </div>
      
      <div class="card-actions justify-end mt-4">
        <button 
          @click="startConversion" 
          :disabled="!fileId || converting"
          class="btn btn-primary"
        >
          <span v-if="converting" class="loading loading-spinner"></span>
          {{ converting ? 'Conversion en cours...' : 'Convertir' }}
        </button>
      </div>
      
      <div v-if="conversionStore.error" class="alert alert-error mt-4">
        <span>{{ conversionStore.error }}</span>
      </div>
      
      <div v-if="result" class="alert alert-success mt-4">
        <div class="flex-1">
          <span>Conversion réussie!</span>
        </div>
        <div class="flex-none">
          <a :href="result.outputPath" download class="btn btn-sm btn-primary">
            Télécharger
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useConversionStore } from '@/stores/conversion.store';

const props = defineProps<{
  fileId: string | null
}>();

const conversionStore = useConversionStore();

const outputFormat = ref('mp4');
const operationType = ref('convert');
const startTime = ref(0);
const endTime = ref(10);
const width = ref(1920);
const height = ref(1080);
const converting = ref(false);
const result = ref<any>(null);

async function startConversion() {
  if (!props.fileId) return;
  
  converting.value = true;
  result.value = null;
  
  try {
    let conversionResult;
    
    switch (operationType.value) {
      case 'extract-audio':
        conversionResult = await conversionStore.extractAudio(props.fileId, outputFormat.value);
        break;
      case 'trim':
        conversionResult = await conversionStore.trimMedia(props.fileId, startTime.value, endTime.value);
        break;
      default:
        conversionResult = await conversionStore.convertMedia({
          fileId: props.fileId,
          outputFormat: outputFormat.value
        });
    }
    
    result.value = conversionResult;
  } catch (error) {
    console.error('Conversion error:', error);
  } finally {
    converting.value = false;
  }
}
</script>
