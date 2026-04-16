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

interface SurveyResultRequest {
    skillsets: number[]
    mods: number[]
}

interface SurveyResultResponse {
    status: string
}

export async function saveSurveyResult(
    data: SurveyResultRequest,
): Promise<SurveyResultResponse> {
    try {
        const res = await axios.post<SurveyResultResponse>(
            `${config.server_url}/survey/save`,
            data,
        )

        return res.data
    } catch (err) {
        console.error(err)
        throw err
    }
}

interface SurveyResultResponse {
    skillsets: number[]
    mods: number[]
}

export async function getSurveyResult(): Promise<SurveyResultResponse> {
    try {
        const res = await axios.get<SurveyResultResponse>(
            `${config.server_url}/survey`,
        )

        return res.data
    } catch (err) {
        console.error(err)
        throw err
    }
}