import config from '../config.ts'
import axios from 'axios'


export async function fetchOsuApiAuthLink(): Promise<string> {
    try {
        const res = await axios.get(`${config.server_url}/auth/osuApiAuthLink`)
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
): Promise<LoginResponse> {
    try {
        const res = await axios.post<LoginResponse>(
            `${config.server_url}/auth/login`,
            { osuApiCode },
        )

        return res.data
    } catch (err) {
        console.error(err)
        throw err
    }
}

interface SaveSkillsRequest {
    skills: number[]
}

interface SaveSkillsResponse {
    status: string
}

interface SaveModsRequest {
    mods: number[]
}

interface SaveModsResponse {
    status: string
}
export async function saveUserSkills(
    skills: number[],
): Promise<SaveSkillsResponse> {
    try {
        const res = await axios.post<SaveSkillsResponse>(
            `${config.server_url}/survey/save`,
            { skills } as SaveSkillsRequest,
        )

        return res.data
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function saveUserMods(
    mods: number[],
): Promise<SaveModsResponse> {
    try {
        const res = await axios.post<SaveSkillsResponse>(
            `${config.server_url}/survey/save`,
            { mods } as SaveModsRequest,
        )

        return res.data
    } catch (err) {
        console.error(err)
        throw err
    }
}