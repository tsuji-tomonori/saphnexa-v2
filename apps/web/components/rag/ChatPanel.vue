<script setup lang="ts">
import type { ChatMessage, Citation } from '~/composables/useRagChat'

defineProps<{ messages: ChatMessage[]; streaming: boolean }>()
const emit = defineEmits<{ preview: [citation: Citation] }>()
</script>

<template>
  <section class="flex-1 overflow-y-auto p-4 md:p-6">
    <UEmpty
      v-if="messages.length === 0"
      icon="i-lucide-message-circle-question"
      title="質問を入力してください"
      description="単一ナレッジベースに対して質問し、回答ストリームと引用元を確認できます。"
      class="min-h-[50vh]"
    />
    <UChatMessages
      v-else
      :messages="messages"
      :status="streaming ? 'streaming' : 'ready'"
      should-scroll-to-bottom
    >
      <UChatMessage
        v-for="message in messages"
        :key="message.id"
        :id="message.id"
        :role="message.role"
        :parts="[{ type: 'text', text: message.content || '回答を生成しています…' }]"
      >
        <template #content>
          <div class="prose prose-sm max-w-none whitespace-pre-wrap text-ink-800">
            {{ message.content || '回答を生成しています…' }}
          </div>
          <CitationList
            v-if="message.role === 'assistant'"
            :citations="message.citations ?? []"
            @preview="emit('preview', $event)"
          />
        </template>
      </UChatMessage>
    </UChatMessages>
  </section>
</template>
