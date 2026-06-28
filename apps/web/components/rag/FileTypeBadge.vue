<script setup lang="ts">
import { computed } from '#imports'

/**
 * ファイル名から種別(PDF/DOC/XLS/TXT)を判定して色付きのモノスペースバッジを表示する。
 * Relay DS の fileTypeStyle を踏襲。
 */
const props = withDefaults(defineProps<{ fileName?: string; size?: number }>(), {
  fileName: '',
  size: 30,
})

const kind = computed<'pdf' | 'doc' | 'xls' | 'txt'>(() => {
  const ext = props.fileName.split('.').pop()?.toLowerCase() ?? ''
  if (ext === 'pdf') return 'pdf'
  if (ext === 'doc' || ext === 'docx') return 'doc'
  if (ext === 'xls' || ext === 'xlsx' || ext === 'csv') return 'xls'
  return 'txt'
})

const label = computed(() => kind.value.toUpperCase())
</script>

<template>
  <span
    class="inline-flex flex-none items-center justify-center rounded-md font-mono font-bold"
    :class="`ft-${kind}`"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      fontSize: `${Math.round(size * 0.33)}px`,
    }"
  >
    {{ label }}
  </span>
</template>
