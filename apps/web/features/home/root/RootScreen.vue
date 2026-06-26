<script setup lang="ts">
interface Props {
  /** 画面に表示する API base URL */
  apiBase: string
}

defineProps<Props>()
</script>

<template>
  <main class="page">
    <h1>Saphnexa v2</h1>
    <p>Nuxt 3 + Hono + AWS CDK + TypeScript の開発環境です。</p>
    <p>API base: {{ apiBase }}</p>
  </main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: grid;
  place-content: center;
  gap: 1rem;
  padding: 2rem;
  font-family: system-ui, sans-serif;
  text-align: center;
}
</style>
