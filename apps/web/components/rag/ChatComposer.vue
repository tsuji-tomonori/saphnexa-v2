<script setup lang="ts">
import { ref } from '#imports'
const props = defineProps<{ streaming: boolean }>()
const emit = defineEmits<{ submit: [message: string]; stop: [] }>()
const prompt = ref('')

function currentPrompt() {
  if (prompt.value.trim()) return prompt.value
  if (!import.meta.client) return ''
  return document.querySelector<HTMLTextAreaElement>('textarea[placeholder="ナレッジベースへ質問する"]')?.value ?? ''
}

function handleSubmit() {
  if (props.streaming) {
    emit('stop')
    return
  }
  const message = currentPrompt().trim()
  if (!message) return
  emit('submit', message)
  prompt.value = ''
}
</script>

<template>
  <div
    class="border-t border-ink-200 bg-white p-4"
  >
    <div
      class="rounded-[14px] border border-ink-200 bg-white p-3 shadow-sm"
    >
      <textarea
        v-model="prompt"
        rows="2"
        placeholder="ナレッジベースへ質問する"
        :disabled="streaming"
        class="min-h-16 w-full resize-none rounded-md border-0 bg-transparent px-2 py-1.5 text-sm leading-6 text-ink-900 placeholder:text-ink-400 focus:outline-none disabled:opacity-75"
      />
      <div class="flex w-full items-center justify-between gap-3 pt-2">
        <p class="text-xs text-ink-500">回答本文と引用元を同じストリームで受信します。</p>
        <button
          type="button"
          :aria-label="streaming ? 'Stop response' : 'Send prompt'"
          class="inline-flex size-9 items-center justify-center rounded-md bg-iris-500 text-white transition-colors hover:bg-iris-600"
          @pointerdown.prevent="handleSubmit"
          @mousedown.prevent="handleSubmit"
          @click="handleSubmit"
        >
          <UIcon :name="streaming ? 'i-lucide-square' : 'i-lucide-send'" class="size-4" />
        </button>
      </div>
    </div>
  </div>
</template>
