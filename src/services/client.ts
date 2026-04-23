import config from '../config.ts'
import axios from 'axios'

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

interface LoginResponse {
    token: string
    userName: string
}

export async function loginWithOsuApiCode(
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
        const res = await axios.post(
            `${config.server_url}/auth/logout`,
            {},
            { withCredentials: true },
        )

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
