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

export const surveyQuestions: SurveyQuestion[] = [
    {
        id: 1,
        title: 'Choose skill sets',
        skills: [
            { id: 1, name: 'Aim' },
            { id: 2, name: 'Speed' },
            { id: 3, name: 'Stamina' },
            { id: 4, name: 'Accuracy' },
            { id: 5, name: 'Reading' },
            { id: 6, name: 'Alternate' },
        ],
        mods: [],
    },
    {
        id: 2,
        title: 'Choose mods',
        skills: [],
        mods: [
            { id: 1, name: 'HD' },
            { id: 2, name: 'DT' },
            { id: 3, name: 'HR' },
            { id: 4, name: 'EZ' },
        ],
    },
]
