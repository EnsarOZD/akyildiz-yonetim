import api from './api'

class ServiceRequestsService {
    async getServiceRequests(status) {
        const params = {}
        if (status) params.status = status
        return api.get('/ServiceRequests', params)
    }

    async createServiceRequest(data) {
        return api.post('/ServiceRequests', data)
    }

    async updateStatus(id, status, adminNote) {
        return api.patch(`/ServiceRequests/${id}/status`, { status, adminNote })
    }

    async assignPersonnel(id, personnelId) {
        return api.patch(`/ServiceRequests/${id}/assign`, { personnelId })
    }

    async resolveRequest(id, resolutionNote) {
        return api.patch(`/ServiceRequests/${id}/resolve`, { resolutionNote })
    }

    async deleteServiceRequest(id) {
        return api.delete(`/ServiceRequests/${id}`)
    }
}

export default new ServiceRequestsService()
