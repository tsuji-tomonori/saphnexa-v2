<script setup lang="ts">
import { useRoute } from '#imports'
const route = useRoute()
const items = [
  { label: 'RAGチャット', icon: 'i-lucide-message-square-text', to: '/chat' },
  { label: '文書管理', icon: 'i-lucide-files', to: '/documents' },
]
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible resizable>
      <template #header>
        <div class="flex items-center gap-2.5 px-2 py-3">
          <span
            class="flex size-8 flex-none items-center justify-center rounded-lg bg-ink-900 font-mono text-base font-bold text-white"
          >
            S
          </span>
          <div>
            <p class="font-bold tracking-tight">Saphnexa</p>
            <p class="font-mono text-[11px] text-ink-500">RAG Console</p>
          </div>
        </div>
      </template>
      <UNavigationMenu orientation="vertical" :items="items" class="px-2" />
      <template #footer>
        <UDropdownMenu
          :items="[[{ label: 'Cognito Managed Loginでログアウト', icon: 'i-lucide-log-out' }]]"
        >
          <UButton color="neutral" variant="ghost" block icon="i-lucide-user-circle"
            >利用者メニュー</UButton
          >
        </UDropdownMenu>
      </template>
    </UDashboardSidebar>
    <UDashboardPanel :id="String(route.name ?? 'app')">
      <slot />
    </UDashboardPanel>
  </UDashboardGroup>
</template>
