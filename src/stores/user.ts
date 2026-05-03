import { defineStore } from 'pinia'
import type { RefreshTokenResponse } from '../types/osu.ts'

const tokenRefreshBufferSeconds = 5

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as null | any,

        authExpiresAt: null as null | number, // timestamp (ms)
        refreshExpiresAt: null as null | number,
    }),

    actions: {
        setTokenExpiry(type: 'auth' | 'refresh', expiresInSeconds: number) {
            //console.log(`${ type } token saved. Will expire in ${expiresInSeconds} seconds`)
            const now = Date.now()
            const expiresAt = now + (expiresInSeconds - tokenRefreshBufferSeconds) * 1000

            if (type === 'auth') {
                this.authExpiresAt = expiresAt
            } else {
                this.refreshExpiresAt = expiresAt
            }
        },

        setUserData(payload: any) {
            this.user = payload.user

            this.setTokenExpiry('auth', payload.authTokenExpiresIn)
            this.setTokenExpiry('refresh', payload.refreshTokenExpiresIn)
        },

        refreshAuthTokens(tokens: RefreshTokenResponse) {
            this.setTokenExpiry('auth', tokens.authTokenExpiresIn)
            this.setTokenExpiry('refresh', tokens.refreshTokenExpiresIn)
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

    persist: true,
})
