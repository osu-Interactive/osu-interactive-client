import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import Login from '@/views/LoginView.vue'
import SurveyView from '@/views/SurveyView.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
    },
    {
        path: '/survey',
        name: 'survey',
        component: SurveyView,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
