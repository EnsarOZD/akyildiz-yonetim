import api from './api'

class ServiceRequestsService {
    async getServiceRequests(status) {
        const params = {}
        if (status) params.status = status
        return api.get('/ServiceRequests', params)
    }

    async createServiceRequest(data) {
        // Always use FormData to match backend [FromForm] endpoint
        const formData = new FormData()
        formData.append('title', data.title)
        formData.append('description', data.description)
        formData.append('category', data.category)
        
        if (data.attachment) {
            formData.append('attachment', data.attachment)
        }
        
        return api.post('/ServiceRequests', formData)
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
}

export default new ServiceRequestsService()
