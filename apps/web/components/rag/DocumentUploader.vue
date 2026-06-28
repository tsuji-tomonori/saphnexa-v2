<script setup lang="ts">
defineProps<{ uploading: boolean; progress: number }>()
const emit = defineEmits<{ upload: [file: File] }>()
function handleUpdate(files: File[] | File | null) {
  const file = Array.isArray(files) ? files[0] : files
  if (file) emit('upload', file)
}
</script>

<template>
  <UCard class="rounded-[14px] border-ink-200 bg-white shadow-sm">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-upload-cloud" class="size-5 text-iris-500" />
        <h2 class="font-semibold text-ink-900">ファイル登録</h2>
      </div>
    </template>
    <UFileUpload
      icon="i-lucide-file-up"
      label="PDFやテキストをドロップ、または選択"
      description="Presigned URLを発行し、ブラウザからS3へ直接PUTします。"
      :disabled="uploading"
      @update:model-value="handleUpdate"
    />
    <UProgress v-if="uploading" :model-value="progress" class="mt-4" />
  </UCard>
</template>
