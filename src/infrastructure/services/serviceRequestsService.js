import api from './api'

class ServiceRequestsService {
    async getServiceRequests(status) {
        const params = {}
        if (status) params.status = status
        return api.get('/service-requests', params)
    }

    async createServiceRequest(payload) {
        return api.post('/service-requests', payload)
    }

    async updateStatus(id, status, adminNote) {
        return api.patch(`/service-requests/${id}/status`, { status, adminNote })
    }
}

export default new ServiceRequestsService()
