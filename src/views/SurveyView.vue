<template>
    <div
        v-if="!surveyStore.isCompleted"
        class="min-h-screen bg-gray-100 flex items-center justify-center px-4"
    >
        <div class="w-full max-w-2xl bg-white rounded-2xl shadow-md p-8">
            <h2 class="text-3xl font-bold text-center mb-2">
                {{ questions[currentStep].title }}
            </h2>

            <p class="text-center text-gray-500 mb-6">
                Step {{ currentStep + 1 }} / {{ questions.length }}
            </p>

            <div class="grid grid-cols-2 gap-4 mb-6">
                <div
                    v-for="skill in questions[currentStep].skills"
                    :key="skill.id"
                    @click="toggleSkill(skill.id)"
                    class="p-6 border-2 rounded-xl cursor-pointer transition text-center font-medium"
                    :class="
                        selectedSkills.includes(skill.id)
                            ? 'border-green-500 bg-green-100'
                            : 'border-gray-300 hover:border-gray-400'
                    "
                >
                    {{ skill.name }}
                </div>

                <div
                    v-for="mod in questions[currentStep].mods"
                    :key="mod.id"
                    @click="toggleMod(mod.id)"
                    class="p-6 border-2 rounded-xl cursor-pointer transition text-center font-medium"
                    :class="
                        selectedMods.includes(mod.id)
                            ? 'border-blue-500 bg-blue-100'
                            : 'border-gray-300 hover:border-gray-400'
                    "
                >
                    {{ mod.name }}
                </div>
            </div>

            <div class="flex justify-between">
                <button
                    @click="prevStep"
                    :disabled="currentStep === 0"
                    class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                    ⬅️ Previous
                </button>

                <button
                    v-if="currentStep < questions.length - 1"
                    @click="nextStep"
                    :disabled="!isStepValid()"
                    class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                >
                    Next ➡️
                </button>

                <button
                    v-else
                    @click="confirmFinish"
                    class="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
                >
                    Finish ✅
                </button>
            </div>
        </div>

        <div
            v-if="showModal"
            class="fixed inset-0 bg-black/50 flex items-center justify-center"
            @click="handleCancel"
        >
            <div
                class="bg-white p-6 rounded-2xl shadow-lg w-80 text-center"
                @click.stop
            >
                <h3 class="text-xl font-semibold mb-2">Are you sure?</h3>
                <p class="text-gray-500 mb-4">You will finish the survey</p>

                <div class="flex justify-between">
                    <button
                        @click="handleCancel"
                        class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                        Cancel
                    </button>

                    <button
                        @click="handleConfirm"
                        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        Yep, finish it
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div
        v-else
        class="min-h-screen flex items-center justify-center bg-gray-100 px-4"
    >
        <div
            class="bg-white p-6 rounded-2xl shadow-md text-center max-w-xl w-full"
        >
            <h2 class="text-2xl font-bold mb-2">
                You have already finished the survey
            </h2>

            <p class="text-gray-500 mb-4">You probably know it tho</p>

            <button
                @click="restartSurvey"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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
import { getSurveyResult, saveSurveyResult } from '@/services/clients/survey.client.ts'

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
