<template>
    <div
        class="min-h-screen text-white bg-[#0F0F1A] bg-[radial-gradient(circle_at_20%_10%,rgba(255,102,170,0.15),transparent_40%),radial-gradient(circle_at_80%_90%,rgba(155,92,255,0.12),transparent_40%)]"
    >
        <nav
            class="sticky top-0 z-50 h-[72px] px-6 md:px-10 flex items-center justify-between bg-[#0F0F1A]/75 backdrop-blur-xl border-b border-white/5 relative"
        >
            <div
                class="absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-[#FF66AA] to-[#9B5CFF] opacity-50"
            />

            <div class="text-2xl font-extrabold text-[#FF66AA]">
                osu!interactive
            </div>

            <div class="hidden md:flex items-center gap-6 text-[#B8B8D1]">
                <RouterLink
                    to="/"
                    @click="closeMenu"
                    class="hover:text-white transition"
                >
                    Home
                </RouterLink>

                <RouterLink
                    to="/survey"
                    @click="closeMenu"
                    class="hover:text-white transition"
                >
                    Survey
                </RouterLink>
            </div>

            <RouterLink
                to="/login"
                @click="closeMenu"
                class="rounded-full px-5 py-2 font-bold text-white bg-linear-to-r from-[#FF66AA] to-[#9B5CFF] shadow-[0_0_22px_rgba(255,102,170,0.45)] hover:scale-105 hover:brightness-110 transition"
            >
                Log in
            </RouterLink>
        </nav>

        <main class="mx-auto max-w-6xl px-6 py-10">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)

const closeMenu = () => {
    isOpen.value = false
}
</script>
