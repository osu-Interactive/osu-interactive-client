import config from '../../config.ts'
import axios from 'axios'
import type { LoginResponse, RefreshTokenResponse } from '@/types/osu.ts'

export default {
    async getOsuOAuthLink(): Promise<string> {
        try {
            const res = await axios.get(
                `${config.server_url}/auth/osuApiAuthLink`,
                { withCredentials: true },
            )
            return res.data.authLink
        } catch (err) {
            throw err
        }
    },

    async login(
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
            throw err
        }
    },

    async logout() {
        try {
            const res = await axios.post(
                `${config.server_url}/auth/logout`,
                {},
                { withCredentials: true },
            )
            return res.data
        } catch (err) {
            throw err
        }
    },

    async refresh(): Promise<RefreshTokenResponse> {
        try {
            const res = await axios.post<RefreshTokenResponse>(
                `${config.server_url}/auth/refresh`,
                {},
                {
                    withCredentials: true,
                },
            )

            return res.data
        } catch (err) {
            throw err
        }
    }
}
