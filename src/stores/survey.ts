import { defineStore } from 'pinia'

export const useSurveyStore = defineStore('survey', {
    state: () => ({
        skillsets: [] as number[],
        mods: [] as number[],
        isCompleted: false,
    }),

    actions: {
        setSurvey(skillsets: number[], mods: number[]) {
            this.skillsets = skillsets
            this.mods = mods
            this.isCompleted = true
        },

        resetSurvey() {
            this.skillsets = []
            this.mods = []
            this.isCompleted = false
        },
    },

    persist: true,
})
