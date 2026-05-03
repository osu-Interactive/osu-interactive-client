<script setup lang="ts">
import { onMounted } from 'vue'
import authService from '@/services/auth.service.ts'

onMounted(async () => {
    await authService.initAuth()
})
</script>

<template>
    <router-view />
</template>
