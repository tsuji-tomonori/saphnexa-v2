<script setup lang="ts">
import { navigateTo } from '#imports'

defineOptions({ name: 'HomeRedirectPage' })
await navigateTo('/chat', { replace: true })
</script>

<template>
  <div />
</template>
