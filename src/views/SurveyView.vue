<template>
  <div class="survey">
    <h2>{{ questions[currentStep].title }}</h2>
    <p>Крок {{ currentStep + 1 }} / {{ questions.length }}</p>
    <div class="grid">
      <div
          v-for="skill in questions[currentStep].skills"
          :key="skill.id"
          class="card"
          :class="{ active: selectedSkills.includes(skill.id) }"
          @click="toggleSkill(skill.id)"
      >
        {{ skill.name }}
      </div>
      <div
          v-for="mod in questions[currentStep].mods"
          :key="mod.id"
          class="card"
          :class="{ active: selectedMods.includes(mod.id) }"
          @click="toggleMod(mod.id)"
      >
        {{ mod.name }}
      </div>
    </div>
    <div class="navigation">
      <button @click="prevStep" :disabled="currentStep === 0">
        ⬅️ Попереднє
      </button>

      <button
          v-if="currentStep < questions.length - 1"
          @click="nextStep"
      >
        Далі ➡️
      </button>

      <button
          v-else
          @click="confirmFinish"
      >
        Завершити ✅
      </button>
    </div>
    <div v-if="showModal" class="modal-overlay" @click="handleCancel">
      <div class="modal" @click.stop>
        <h3>Are you sure?</h3>
        <p>Ти завершиш опитування</p>

        <div class="modal-actions">
          <button class="cancel" @click="handleCancel">
            Скасувати
          </button>

          <button class="confirm" @click="handleConfirm">
            Так, завершити
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import { saveUserSkills } from "@/services/client"
import { useRouter } from "vue-router"

const router = useRouter()

interface Skill {
  id: number
  name: string
}
interface Mod {
  id: number
  name: string
}


const selectedSkills = ref<number[]>([])
const selectedMods = ref<number[]>([])

interface Question {
  id: number
  title: string
  skills: Skill[]
  mods: Mod[]
}

const questions = ref<Question[]>([
  {
    id: 1,
    title: "Choose skill sets",
    skills: [
      { id: 1, name: "Aim" },
      { id: 2, name: "Speed" },
      { id: 3, name: "Stamina" },
      { id: 4, name: "Accuracy" },
      { id: 5, name: "Reading" },
      { id: 6, name: "Alternate" },
    ],
    mods: []
  },
  {
    id: 2,
    title: "Choose mods",
    skills: [],
    mods: [
      { id: 1, name: "HD" },
      { id: 2, name: "DT" },
      { id: 3, name: "HR" },
      { id: 4, name: "EZ" },
    ]
  }
])

const currentStep = ref(0)

const nextStep = () => {
  if (currentStep.value < questions.value.length - 1) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const showModal = ref(false)

const confirmFinish = () => {
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
  console.log("Selected:", selectedSkills.value, selectedMods.value)

  setTimeout(() => {
    router.push({ name: "home" })
  }, 300)

//  Як буде сервер - те що зверху замінити на комент
//
//   try {
//   await saveUserSkills(selectedSkills.value)
//   router.push({ name: "home" })
// } catch (err) {
//   console.error("Помилка збереження", err)
// }

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

const loadSelection = () => {
  const savedS = localStorage.getItem("skills")
  const savedM = localStorage.getItem("mods")
  if (savedS && savedM) {
    try {
      selectedSkills.value = JSON.parse(savedS)
      selectedMods.value = JSON.parse(savedM)
    } catch {
      selectedSkills.value = []
      selectedMods.value = []
    }
  }
}

let timeout: ReturnType<typeof setTimeout>

watch(selectedSkills, async (newValue) => {
  clearTimeout(timeout)
  timeout = setTimeout(async () => {
    await saveUserSkills(newValue)
  }, 300)
})

onMounted(loadSelection)
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.card {
  padding: 20px;
  border: 2px solid #ccc;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s;
}

.card:hover {
  border-color: #888;
}

.card.active {
  border-color: #42b883;
  background: #e6f7f1;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 1000;
}

.modal {
  background: white;
  padding: 24px;
  border-radius: 16px;
  width: 300px;
  text-align: center;

  animation: fadeIn 0.2s ease;
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.cancel {
  background: #ccc;
}

.confirm {
  background: #42b883;
  color: white;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>