export interface SurveySkill {
    id: number
    name: string
}

export interface SurveyMod {
    id: number
    name: string
}

export interface SurveyQuestion {
    id: number
    title: string
    skills: SurveySkill[]
    mods: SurveyMod[]
}

export interface SurveyOption {
    id: number
    code: string
    name: string
}



