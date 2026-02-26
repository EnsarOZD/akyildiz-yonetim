import apiService from './api.js'

export const notificationsService = {
    async getNotifications(unreadOnly = false, take = 20, skip = 0) {
        return await apiService.get('/notifications', { unreadOnly, take, skip })
    },

    async markAsRead(id) {
        await apiService.post(`/notifications/${id}/read`)
    },

    async markAllAsRead() {
        await apiService.post('/notifications/read-all')
    },

    async broadcast(title, message) {
        await apiService.post('/notifications/broadcast', { title, message })
    }
}
