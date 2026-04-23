<script setup lang="ts">
import { fetchOsuApiAuthLink, loginWithOsuApiCode, sendLogoutRequest, getMe as fetchMe } from '../services/client.ts'

import { ref, onMounted } from 'vue'

const code = ref<string | null>(null)
const state = ref<string | null>(null)

onMounted(async () => {
    const url = new URL(window.location.href)
    const params = url.searchParams

    const hasAuthParams = params.has('code') && params.has('state')

    if (hasAuthParams) {
        code.value = params.get('code')
        state.value = params.get('state')

        params.delete('code')
        params.delete('state')

        const newUrl = url.pathname + (params.toString() ? `?${params}` : '')
        window.history.replaceState({}, '', newUrl)

        const loginData = await loginWithOsuApiCode(code.value!, state.value!)
        console.log(loginData)
    }
})
async function logout() {
    console.log(await sendLogoutRequest())
}

async function redirectToOsuApiLogin(): Promise<void> {
    window.location.href = await fetchOsuApiAuthLink()
}

async function getMe(): Promise<void> {
    const loginData = await fetchMe();
    console.log(loginData)
}
</script>

<template>
    <button @click="redirectToOsuApiLogin">Login</button>
    <button @click="logout">Logout</button>
    <button @click="getMe">Get Info About me</button>
</template>
