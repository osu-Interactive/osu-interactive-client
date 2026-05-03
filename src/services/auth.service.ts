import { useUserStore } from '@/stores/user.ts'
import type { RefreshTokenResponse } from '@/types/osu.ts'
import authClient from './clients/auth.client.ts'

export default {
    async initAuth() {
        const store = useUserStore()
        if (store.isAuthExpired()) {
            if (!store.isRefreshExpired()) {
                await this.refreshAuth()
                console.log('Your session was restored')
            } else {
                alert('Your session has expired')
            }
        } else {
            console.log("You're authorized")
        }
    },

    async getOsuOAuthLink() {
        return await authClient.getOsuOAuthLink()
    },

    async login(osuApiCode: string, osuApiState: string) {
        const store = useUserStore()
        const loginResult = await authClient.login(osuApiCode, osuApiState)
        store.setUserData(loginResult)
        return loginResult
    },

    async logout() {
        const store = useUserStore()
        const logoutResult = await authClient.logout()
        store.logout()
        return logoutResult
    },

    async refreshAuth(): Promise<RefreshTokenResponse> {
        const store = useUserStore()
        const refreshTokens = await authClient.refresh()
        store.refreshAuthTokens(refreshTokens)

        return refreshTokens
    },
}
