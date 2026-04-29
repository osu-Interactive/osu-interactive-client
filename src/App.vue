<script setup lang="ts">
import { onMounted } from 'vue'
import { initAuth } from './services/client-auth'

onMounted(() => {
    initAuth()
})
</script>

<template>
    <router-view />
</template>
