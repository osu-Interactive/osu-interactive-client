import config from '../config.ts'
import axios from 'axios'
import { useUserStore } from '@/stores/user.ts'

import type { LoginResponse, RefreshTokenResponse } from "@/types/osu.ts";

export async function fetchOsuApiAuthLink(): Promise<string> {
    try {
        const res = await axios.get(
            `${config.server_url}/auth/osuApiAuthLink`,
            { withCredentials: true },
        )
        return res.data.authLink
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function login(osuApiCode: string, osuApiState: string) {
    const store = useUserStore()
    const loginResult = await loginRequest(osuApiCode, osuApiState)
    store.setUserData(loginResult)
    return loginResult
}

export async function loginRequest(
    osuApiCode: string,
    osuApiState: string,
): Promise<LoginResponse> {
    try {
        const res = await axios.post<LoginResponse>(
            `${config.server_url}/auth/login`,
            { osuApiCode, osuApiState },
            { withCredentials: true },
        )

        return res.data
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function sendLogoutRequest() {
    try {
        const store = useUserStore()
        const res = await axios.post(
            `${config.server_url}/auth/logout`,
            {},
            { withCredentials: true },
        )
        store.logout()
        return res.data
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function getMe() {
    try {
        const res = await axios.get(`${config.server_url}/auth/me`, {
            withCredentials: true,
        })

        return res.data
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function refreshAuth(): Promise<RefreshTokenResponse> {
    try {
        const store = useUserStore()
        const res = await axios.post<RefreshTokenResponse>(
            `${config.server_url}/auth/refresh`,
            {},
            {
                withCredentials: true,
            },
        )
        const refreshTokens = res.data
        store.refreshAuthTokens(refreshTokens)
        return refreshTokens
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function initAuth() {
    const store = useUserStore()

    console.log(store.authExpiresInSeconds)
    console.log(store.refreshExpiresInSeconds)
    if (store.isAuthExpired) {
        if (!store.isRefreshExpired) {
            await refreshAuth()
            console.log('Your session was restored')
        } else {
            alert('Your session has expired')
        }
    } else {
        console.log("You're authorized")
    }
}
