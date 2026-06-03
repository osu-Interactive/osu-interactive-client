import axios from 'axios'
import config from '../../config.ts'

export interface SurveyResultRequest {
    skillsets: number[]
    mods: number[]
}

export interface SurveyOption {
    id: number
    code: string
    name: string
}

export interface SurveyResultResponse {
    skillsets: SurveyOption[]
    mods: SurveyOption[]
    selectedSkillsets: number[]
    selectedMods: number[]
}

export async function saveSurveyResult(
    data: SurveyResultRequest,
): Promise<void> {
    try {
        await axios.post(`${config.server_url}/user/survey/save`, data, {
            withCredentials: true,
        })
    } catch (err) {
        throw err
    }
}

export async function getSurveyResult(): Promise<SurveyResultResponse> {
    try {
        const res = await axios.get<SurveyResultResponse>(
            `${config.server_url}/user/survey`,
            { withCredentials: true },
        )

        return res.data
    } catch (err) {
        throw err
    }
}
