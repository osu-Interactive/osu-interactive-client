<script setup lang="ts">
import { fetchOsuApiAuthLink, loginWithOsuApiCode } from '../services/client.ts'
import { ref, onMounted } from 'vue'

const code = ref<string | null>(null)

onMounted(async () => {
    const url = new URL(window.location.href)
    const params = url.searchParams

    if (params.has('code')) {
        code.value = params.get('code')

        params.delete('code')

        const newUrl = url.pathname + (params.toString() ? `?${params}` : '')
        window.history.replaceState({}, '', newUrl)
    }

    if (code.value) {
        const loginData = await loginWithOsuApiCode(code.value)

        console.log(loginData)
    }
})

async function redirectToOsuApiLogin(): Promise<void> {
    window.location.href = await fetchOsuApiAuthLink()
}
</script>

<template>
    <button @click="redirectToOsuApiLogin">Login</button>
</template>
