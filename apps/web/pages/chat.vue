<script setup lang="ts">
import { ref } from '#imports'
import { useRagChat } from '~/composables/useRagChat'

defineOptions({ name: 'ChatPage' })
import type { Citation } from '~/composables/useRagChat'

const chat = useRagChat()
const selectedCitation = ref<Citation>()
const previewOpen = ref(false)
function openPreview(citation: Citation) {
  selectedCitation.value = citation
  previewOpen.value = true
}
</script>

<template>
  <AppShell>
    <UDashboardNavbar
      title="RAGチャット"
      description="単一ナレッジベースに質問し、回答ストリームと引用元を確認します。"
    >
      <template #right>
        <UButton icon="i-lucide-rotate-ccw" color="neutral" variant="ghost" @click="chat.clear"
          >クリア</UButton
        >
      </template>
    </UDashboardNavbar>
    <UAlert
      v-if="chat.errorMessage.value"
      color="error"
      variant="soft"
      icon="i-lucide-circle-alert"
      :description="chat.errorMessage.value"
      class="m-4"
    />
    <div class="flex min-h-[calc(100vh-4rem)] flex-col bg-ink-50">
      <ChatPanel
        :messages="chat.messages.value"
        :streaming="chat.status.value === 'streaming'"
        @preview="openPreview"
      />
      <ChatComposer
        :streaming="chat.status.value === 'streaming'"
        @submit="chat.sendMessage"
        @stop="chat.stop"
      />
    </div>
    <SourcePreview v-model:open="previewOpen" :citation="selectedCitation" />
  </AppShell>
</template>
