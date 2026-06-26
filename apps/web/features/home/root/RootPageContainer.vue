<script setup lang="ts">
import RootScreen from './RootScreen.vue'

const config = useRuntimeConfig()
</script>

<template>
  <RootScreen :api-base="config.public.apiBase" />
</template>
