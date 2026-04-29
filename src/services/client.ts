import config from '../config.ts'
import axios from 'axios'

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
            `${config.server_url}/user/survey/save`,
            data,
            { withCredentials: true },
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
            `${config.server_url}/user/survey`,
            { withCredentials: true  },
        )

        return res.data
    } catch (err) {
        console.error(err)
        throw err
    }
}
