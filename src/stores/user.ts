import { defineStore } from 'pinia'
import type { RefreshTokenResponse } from '../types/osu.ts'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as null | any,

        authExpiresAt: null as null | number, // timestamp (ms)
        refreshExpiresAt: null as null | number,
    }),

    actions: {
        setUserData(payload: any) {
            const now = Date.now()

            this.user = payload.user

            this.authExpiresAt = now + payload.authTokenExpiresIn * 1000
            this.refreshExpiresAt = now + payload.refreshTokenExpiresIn * 1000
        },

        refreshAuthTokens(tokens: RefreshTokenResponse) {
            const now = Date.now()
            this.authExpiresAt = now + tokens.authTokenExpiresIn * 1000
            this.refreshExpiresAt = now + tokens.refreshTokenExpiresIn * 1000
        },

        logout() {
            this.user = null
            this.authExpiresAt = null
            this.refreshExpiresAt = null
        }
    },

    getters: {
        isAuthExpired: (state) =>
        state.authExpiresAt ? Date.now() > state.authExpiresAt : true,

        isRefreshExpired: (state) =>
            state.refreshExpiresAt ? Date.now() > state.refreshExpiresAt : true,

        authExpiresInSeconds: (state) => {
            if (!state.authExpiresAt) return 0
            return Math.max(0, Math.floor((state.authExpiresAt - Date.now()) / 1000))
        },

        refreshExpiresInSeconds: (state) => {
            if (!state.refreshExpiresAt) return 0
            return Math.max(0, Math.floor((state.refreshExpiresAt - Date.now()) / 1000))
        },
    },

    persist: true,
})