<template>
  <div class="survey">
    <h1>Select your preferable skill sets.</h1>

    <div class="grid">
      <div
          v-for="skill in skills"
          :key="skill.id"
          class="card"
          :class="{ active: selectedSkills.includes(skill.id) }"
          @click="toggleSkill(skill.id)"
      >
        <h3>{{ skill.name }}</h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import { saveUserSkills } from "@/services/client"

interface Skill {
  id: number
  name: string
}

const skills = ref<Skill[]>([
  { id: 1, name: "Aim" },
  { id: 2, name: "Speed" },
  { id: 3, name: "Stamina" },
  { id: 4, name: "Accuracy" },
  { id: 5, name: "Reading" },
  { id: 6, name: "Alternate" },
])

const selectedSkills = ref<number[]>([])

const toggleSkill = (id: number) => {
  const index = selectedSkills.value.indexOf(id)

  if (index !== -1) {
    selectedSkills.value.splice(index, 1)
  } else {
    selectedSkills.value.push(id)
  }
}

const loadSelection = () => {
  const saved = localStorage.getItem("skills")
  if (saved) {
    try {
      selectedSkills.value = JSON.parse(saved)
    } catch {
      selectedSkills.value = []
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
</style>