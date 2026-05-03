import axios from '@/utils/axios-instance.ts'
import config from '@/config.ts'

export default {
    async getMe() {
        try {
            const res = await axios.get(`${config.server_url}/auth/me`, {
                requiresAuth: true,
            })

            return res.data
        } catch (err) {
            throw err
        }
    }
}
