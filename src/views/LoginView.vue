<script setup lang="ts">
import { ref, onMounted } from 'vue'
import authService from '../services/auth.service.ts'
import userClient from '../services/clients/user.client.ts'

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

        const loginData = await authService.login(code.value!, state.value!)
        console.log(loginData)
    }
})

async function logout() {
    console.log(await authService.logout())
}

async function redirectToOsuApiLogin(): Promise<void> {
    window.location.href = await authService.getOsuOAuthLink()
}

async function getMe(): Promise<void> {
    const loginData = await userClient.getMe()
    console.log(loginData)
}

async function refresh() {
    const refreshResult = await authService.refreshAuth()
    console.log(refreshResult)
}
</script>

<template>
    <button @click="redirectToOsuApiLogin">Login</button>
    <button @click="logout">Logout</button>
    <button @click="getMe">Get Info About me</button>
    <button @click="refresh">Refresh Auth</button>
</template>

<style scoped>
  button {
    border: 1px solid black;
    margin-left: 6px;
    padding: 4px;
    border-radius: 4px;
  }
</style>
