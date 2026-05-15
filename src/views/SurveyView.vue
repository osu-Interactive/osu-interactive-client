<template>
    <div
        v-if="!surveyStore.isCompleted"
        class="min-h-screen flex items-center justify-center px-4 text-white bg-[#0F0F1A] bg-[radial-gradient(circle_at_20%_10%,rgba(255,102,170,0.16),transparent_40%),radial-gradient(circle_at_80%_90%,rgba(155,92,255,0.14),transparent_40%)]"
    >
        <div
            class="w-full max-w-2xl rounded-[28px] border border-white/10 bg-white/6 p-8 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
        >
            <h2 class="text-3xl font-extrabold text-center mb-2 text-white">
                {{ questions[currentStep].title }}
            </h2>

            <p class="text-center text-[#B8B8D1] mb-6">
                Step {{ currentStep + 1 }} / {{ questions.length }}
            </p>

            <div class="grid grid-cols-2 gap-4 mb-6">
                <div
                    v-for="skill in questions[currentStep].skills"
                    :key="skill.id"
                    @click="toggleSkill(skill.id)"
                    class="p-6 border rounded-2xl cursor-pointer transition text-center font-bold bg-[#23233A]/80 hover:-translate-y-1 hover:border-[#FF66AA] hover:shadow-[0_0_22px_rgba(255,102,170,0.25)]"
                    :class="
                        selectedSkills.includes(skill.id)
                            ? 'border-[#FF66AA] bg-linear-to-br from-[#FF66AA]/30 to-[#9B5CFF]/25 shadow-[0_0_24px_rgba(255,102,170,0.35)]'
                            : 'border-white/10 text-[#B8B8D1]'
                    "
                >
                    {{ skill.name }}
                </div>

                <div
                    v-for="mod in questions[currentStep].mods"
                    :key="mod.id"
                    @click="toggleMod(mod.id)"
                    class="p-6 border rounded-2xl cursor-pointer transition text-center font-bold bg-[#23233A]/80 hover:-translate-y-1 hover:border-[#9B5CFF] hover:shadow-[0_0_22px_rgba(155,92,255,0.25)]"
                    :class="
                        selectedMods.includes(mod.id)
                            ? 'border-[#9B5CFF] bg-linear-to-br from-[#9B5CFF]/30 to-[#FF66AA]/25 shadow-[0_0_24px_rgba(155,92,255,0.35)]'
                            : 'border-white/10 text-[#B8B8D1]'
                    "
                >
                    {{ mod.name }}
                </div>
            </div>

            <div class="flex justify-between gap-4">
                <button
                    @click="prevStep"
                    :disabled="currentStep === 0"
                    class="px-5 py-3 rounded-full font-bold transition bg-white/10 text-white border border-white/10 hover:bg-white/15 disabled:opacity-40 disabled:hover:bg-white/10"
                >
                    Previous
                </button>

                <button
                    v-if="currentStep < questions.length - 1"
                    @click="nextStep"
                    :disabled="!isStepValid()"
                    class="px-5 py-3 rounded-full font-bold text-white transition bg-linear-to-r from-[#FF66AA] to-[#9B5CFF] shadow-[0_0_22px_rgba(255,102,170,0.45)] hover:scale-105 hover:brightness-110 disabled:opacity-40 disabled:hover:scale-100 disabled:hover:brightness-100"
                >
                    Next
                </button>

                <button
                    v-else
                    @click="confirmFinish"
                    class="px-5 py-3 rounded-full font-bold text-white transition bg-linear-to-r from-[#FF66AA] to-[#9B5CFF] shadow-[0_0_22px_rgba(255,102,170,0.45)] hover:scale-105 hover:brightness-110"
                >
                    Finish
                </button>
            </div>
        </div>

        <div
            v-if="showModal"
            class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
            @click="handleCancel"
        >
            <div
                class="w-80 rounded-[28px] border border-white/10 bg-[#1A1A2E]/95 p-6 text-center text-white shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
                @click.stop
            >
                <h3 class="text-xl font-extrabold mb-2">Are you sure?</h3>

                <p class="text-[#B8B8D1] mb-4">You will finish the survey</p>

                <div class="flex justify-between gap-3">
                    <button
                        @click="handleCancel"
                        class="px-4 py-2 rounded-full font-bold transition bg-white/10 text-white border border-white/10 hover:bg-white/15"
                    >
                        Wait no!
                    </button>

                    <button
                        @click="handleConfirm"
                        class="px-4 py-2 rounded-full font-bold text-white transition bg-linear-to-r from-[#FF66AA] to-[#9B5CFF] shadow-[0_0_18px_rgba(255,102,170,0.4)] hover:scale-105 hover:brightness-110"
                    >
                        Yep, finish it!
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div
        v-else
        class="min-h-screen flex items-center justify-center px-4 text-white bg-[#0F0F1A] bg-[radial-gradient(circle_at_20%_10%,rgba(255,102,170,0.16),transparent_40%),radial-gradient(circle_at_80%_90%,rgba(155,92,255,0.14),transparent_40%)]"
    >
        <div
            class="max-w-xl w-full rounded-[28px] border border-white/10 bg-white/6 p-8 text-center backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
        >
            <h2 class="text-2xl font-extrabold mb-2 text-white">
                You have already finished the survey
            </h2>

            <p class="text-[#B8B8D1] mb-5">You probably know it tho</p>

            <button
                @click="restartSurvey"
                class="px-5 py-3 rounded-full font-bold text-white transition bg-linear-to-r from-[#FF66AA] to-[#9B5CFF] shadow-[0_0_22px_rgba(255,102,170,0.45)] hover:scale-105 hover:brightness-110"
            >
                Changed your mind?
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSurveyStore } from '@/stores/survey'
import { surveyQuestions } from '@/constants/survey-questions'
import {
    getSurveyResult,
    saveSurveyResult,
} from '@/services/clients/survey.client.ts'

const router = useRouter()
const surveyStore = useSurveyStore()

const selectedSkills = ref<number[]>([])
const selectedMods = ref<number[]>([])
const questions = surveyQuestions

const currentStep = ref(0)

const nextStep = () => {
    if (currentStep.value < questions.length - 1) {
        currentStep.value++
    }
}

const prevStep = () => {
    if (currentStep.value > 0) {
        currentStep.value--
    }
}

const isStepValid = () => {
    const q = questions[currentStep.value]

    if (q.skills.length > 0) {
        return selectedSkills.value.length > 0
    }

    if (q.mods.length > 0) {
        return selectedMods.value.length > 0
    }

    return true
}

const showModal = ref(false)

const confirmFinish = () => {
    if (!isStepValid()) return
    showModal.value = true
}

const handleConfirm = () => {
    showModal.value = false
    finishSurvey()
}

const handleCancel = () => {
    showModal.value = false
}

const finishSurvey = async () => {
    try {
        await saveSurveyResult({
            skillsets: selectedSkills.value,
            mods: selectedMods.value,
        })

        surveyStore.setSurvey(selectedSkills.value, selectedMods.value)

        router.push({ name: 'home' })
    } catch (err) {
        console.error('Помилка збереження', err)
    }
}

const restartSurvey = () => {
    surveyStore.resetSurvey()

    selectedSkills.value = []
    selectedMods.value = []
    currentStep.value = 0
}

const toggleSkill = (id: number) => {
    const indexS = selectedSkills.value.indexOf(id)

    if (indexS !== -1) {
        selectedSkills.value.splice(indexS, 1)
    } else {
        selectedSkills.value.push(id)
    }
}

const toggleMod = (id: number) => {
    const indexM = selectedMods.value.indexOf(id)

    if (indexM !== -1) {
        selectedMods.value.splice(indexM, 1)
    } else {
        selectedMods.value.push(id)
    }
}

onMounted(async () => {
    try {
        if (surveyStore.isCompleted) {
            selectedSkills.value = surveyStore.skillsets
            selectedMods.value = surveyStore.mods
            return
        }

        const data = await getSurveyResult()

        selectedSkills.value = data.skillsets || []
        selectedMods.value = data.mods || []

        if (data.skillsets?.length || data.mods?.length) {
            surveyStore.setSurvey(data.skillsets || [], data.mods || [])
        }
    } catch (err) {
        console.error('Не вдалося завантажити survey', err)
    }
})
</script>

<style scoped></style>
