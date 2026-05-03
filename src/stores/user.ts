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

            this.authExpiresAt = now + (payload.authTokenExpiresIn - 2) * 1000
            this.refreshExpiresAt = now + (payload.refreshTokenExpiresIn - 2) * 1000
        },

        refreshAuthTokens(tokens: RefreshTokenResponse) {
            console.log(tokens.authTokenExpiresIn, tokens.refreshTokenExpiresIn)
            const now = Date.now()
            this.authExpiresAt = now + (tokens.authTokenExpiresIn - 2) * 1000
            this.refreshExpiresAt = now + (tokens.refreshTokenExpiresIn - 2) * 1000
        },

        logout() {
            this.user = null
            this.authExpiresAt = null
            this.refreshExpiresAt = null
        },

        isAuthExpired() {
            return this.authExpiresAt
                ? Date.now() > this.authExpiresAt
                : true
        },

        isRefreshExpired() {
            return this.refreshExpiresAt
                ? Date.now() > this.refreshExpiresAt
                : true
        },
    },

    getters: {
        authExpiresInSeconds: (state) => {
            if (!state.authExpiresAt) return 0
            return Math.max(
                0,
                Math.floor((state.authExpiresAt - Date.now()) / 1000),
            )
        },

        refreshExpiresInSeconds: (state) => {
            if (!state.refreshExpiresAt) return 0
            return Math.max(
                0,
                Math.floor((state.refreshExpiresAt - Date.now()) / 1000),
            )
        },
    },

    persist: true,
})
