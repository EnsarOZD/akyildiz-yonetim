import api from './api'

class ServiceRequestsService {
    async getServiceRequests(status) {
        const params = {}
        if (status) params.status = status
        return api.get('/ServiceRequests', params)
    }

    async createServiceRequest(data) {
        // Handle image attachment (FormData)
        if (data.attachment) {
            const formData = new FormData()
            // .NET FromForm prefers matching case or camelCase depending on config, 
            // but usually handles both. I'll stick to standard keys but 
            // will match the record property names for safety if needed.
            formData.append('title', data.title)
            formData.append('description', data.description)
            formData.append('category', data.category)
            formData.append('attachment', data.attachment)
            
            return api.post('/ServiceRequests', formData)
        }
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
}

export default new ServiceRequestsService()
