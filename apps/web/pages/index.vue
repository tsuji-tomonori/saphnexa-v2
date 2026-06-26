<script setup lang="ts">
/* global definePageMeta */
import RootPageContainer from '../features/home/root/RootPageContainer.vue'
import { rootScreen } from '../features/home/root/screen.contract'

defineOptions({ name: 'HomePage' })

definePageMeta({
  name: rootScreen.route.name,
  path: rootScreen.route.path,
  layout: rootScreen.layout,
  screenId: rootScreen.id,
  authMode: rootScreen.access.mode,
  requiredPermissions: rootScreen.access.permissions,
})
</script>

<template>
  <RootPageContainer />
</template>
