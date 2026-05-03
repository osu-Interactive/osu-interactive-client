import axios, { AxiosError } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import config from '../config.ts'
import authService from '../services/auth.service.ts'
import type { RefreshTokenResponse } from '@/types/osu.ts'
import { useUserStore } from '@/stores/user.ts'

let authRefreshTokenPromise: Promise<RefreshTokenResponse> | null = null

function refreshAuthOnce() {
    if (!authRefreshTokenPromise) {
        authRefreshTokenPromise = authService.refreshAuth().finally(() => {
            authRefreshTokenPromise = null
        })
    }

    return authRefreshTokenPromise
}

async function checkIfAuthExpired() {
    let store = useUserStore()

    if (store.isAuthExpired() && !store.isRefreshExpired()){
        console.log('Refreshing auth before request')
        await refreshAuthOnce()
    }

    console.log(
        `Auth token ${store.isAuthExpired()}, Refresh Token: ${store.isRefreshExpired()}`,
    )
    return
}

const axiosInstance = axios.create({
    baseURL: config.server_url,
    withCredentials: true,
})

axiosInstance.interceptors.request.use(
    async (request: InternalAxiosRequestConfig) => {
        if (request.requiresAuth) {
            await checkIfAuthExpired()
        }

        return request
    },
    (error) => Promise.reject(error),
)

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        let store = useUserStore()
        const originalRequest = error.config as InternalAxiosRequestConfig

        // if 401 status code from server repeat the request
        if (
            error.response?.status === 401 &&
            originalRequest?.requiresAuth &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true

            if (store.isRefreshExpired()) {
                store.logout()
                return Promise.reject(error)
            }

            try {
                await refreshAuthOnce()
                return axiosInstance(originalRequest)
            } catch (refreshError) {
                store.logout()
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    },
)

export default axiosInstance
