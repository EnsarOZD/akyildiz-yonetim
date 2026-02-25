import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export const notificationsService = {
    async getNotifications(unreadOnly = false, take = 20, skip = 0) {
        const response = await axios.get(`${API_BASE_URL}/api/notifications`, {
            params: { unreadOnly, take, skip }
        })
        return response.data
    },

    async markAsRead(id) {
        await axios.post(`${API_BASE_URL}/api/notifications/${id}/read`)
    },

    async markAllAsRead() {
        await axios.post(`${API_BASE_URL}/api/notifications/read-all`)
    }
}
