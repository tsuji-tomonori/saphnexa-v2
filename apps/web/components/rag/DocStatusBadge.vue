<script setup lang="ts">
import { computed } from '#imports'
import type { DocumentSummary } from '~/composables/useDocuments'

/**
 * ドット付きのステータスバッジ (Relay DS StatusBadge)。
 * 処理中はドットを点滅させる。
 */
const props = defineProps<{ status: DocumentSummary['status'] }>()

type Tone = { label: string; bg: string; fg: string; dot: string; pulse: boolean }

const TONES: Record<DocumentSummary['status'], Tone> = {
  ready: { label: '処理済', bg: '#e9f6ee', fg: '#1f7d4d', dot: '#2f9e64', pulse: false },
  processing: { label: '処理中', bg: '#fbf3e3', fg: '#9a6a13', dot: '#c98a1a', pulse: true },
  uploading: { label: 'アップロード中', bg: '#eeeefb', fg: '#4646b8', dot: '#5b5bd6', pulse: true },
  failed: { label: 'エラー', bg: '#fdece8', fg: '#b23e2e', dot: '#d4503e', pulse: false },
  deleting: { label: '削除中', bg: '#f4f5f7', fg: '#62656e', dot: '#b4b7bf', pulse: true },
}

const tone = computed(() => TONES[props.status])
</script>

<template>
  <span
    class="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
    :style="{ background: tone.bg, color: tone.fg }"
  >
    <span
      class="size-1.5 rounded-full"
      :class="{ 'animate-pulse': tone.pulse }"
      :style="{ background: tone.dot }"
    />
    {{ tone.label }}
  </span>
</template>
