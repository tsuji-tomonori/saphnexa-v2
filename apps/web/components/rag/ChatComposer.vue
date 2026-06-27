<script setup lang="ts">
import { ref } from '#imports'
const props = defineProps<{ streaming: boolean }>()
const emit = defineEmits<{ submit: [message: string]; stop: [] }>()
const prompt = ref('')
function handleSubmit() {
  if (props.streaming) {
    emit('stop')
    return
  }
  const message = prompt.value.trim()
  if (!message) return
  emit('submit', message)
  prompt.value = ''
}
</script>

<template>
  <form
    class="border-t border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950"
    @submit.prevent="handleSubmit"
  >
    <UChatPrompt v-model="prompt" placeholder="ナレッジベースへ質問する" :disabled="streaming">
      <template #footer>
        <div class="flex w-full items-center justify-between gap-3">
          <p class="text-xs text-gray-500">回答本文と引用元を同じストリームで受信します。</p>
          <UChatPromptSubmit :status="streaming ? 'streaming' : 'ready'" @click="handleSubmit" />
        </div>
      </template>
    </UChatPrompt>
  </form>
</template>
