<script setup lang="ts">
import { onMounted } from 'vue'
import authService from '@/services/auth.service.ts'
import Navbar from '@/components/Navbar.vue'

onMounted(async () => {
    await authService.initAuth()
})
</script>

<template>
    <Navbar>
        <RouterView />
    </Navbar>
</template>
