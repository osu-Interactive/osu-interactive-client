import axios from '@/utils/axios-instance.ts'
import config from '@/config.ts'

export default {
    async getMe() {
        try {
            const res = await axios.get(`${config.server_url}/user`, {
                requiresAuth: true,
            })

            return res.data
        } catch (err) {
            throw err
        }
    }
}
