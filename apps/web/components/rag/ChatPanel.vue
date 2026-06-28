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
      <article
        v-for="message in messages"
        :key="message.id"
        class="mb-5 flex w-full min-w-0 last:mb-0"
        :class="message.role === 'user' ? 'justify-start' : 'justify-start'"
        :aria-label="message.role === 'user' ? '質問' : '回答'"
      >
        <div
          class="flex w-full min-w-0 max-w-3xl flex-col gap-2"
          :class="message.role === 'user' ? 'items-start' : 'items-start'"
        >
          <p
            class="font-mono text-[11px] font-semibold leading-none text-ink-500"
            :class="message.role === 'user' ? 'text-left' : 'text-left'"
          >
            {{ message.role === 'user' ? '質問' : '回答' }}
          </p>
          <div
            class="min-w-0 max-w-full whitespace-pre-wrap break-all px-4 py-3 text-sm leading-7 shadow-sm"
            :class="message.role === 'user'
              ? 'rounded-[14px] rounded-bl-md bg-iris-500 text-white'
              : 'rounded-[14px] rounded-bl-md border border-ink-200 bg-white text-ink-800'"
          >
            {{ message.content || '回答を生成しています…' }}
          </div>
          <CitationList
            v-if="message.role === 'assistant'"
            :citations="message.citations ?? []"
            @preview="emit('preview', $event)"
          />
        </div>
      </article>
    </UChatMessages>
  </section>
</template>
