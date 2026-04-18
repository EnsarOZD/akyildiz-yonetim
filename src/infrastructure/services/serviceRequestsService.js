import api from './api'

class ServiceRequestsService {
    async getServiceRequests(status) {
        const params = {}
        if (status) params.status = status
        return api.get('/service-requests', params)
    }

    async createServiceRequest(data) {
        // Handle image attachment (FormData)
        if (data.attachment) {
            const formData = new FormData()
            formData.append('title', data.title)
            formData.append('description', data.description)
            formData.append('category', data.category)
            formData.append('attachment', data.attachment)
            
            // Using request directly since apiService might need a custom multipart config 
            // but ApiService.request handles FormData if check is correct.
            // Let's assume api.post(endpoint, formData) works as ApiService.request checks for FormData.
            return api.post('/service-requests', formData)
        }
        return api.post('/service-requests', data)
    }

    async updateStatus(id, status, adminNote) {
        return api.patch(`/service-requests/${id}/status`, { status, adminNote })
    }

    async assignPersonnel(id, personnelId) {
        return api.patch(`/service-requests/${id}/assign`, { personnelId })
    }

    async resolveRequest(id, resolutionNote) {
        return api.patch(`/service-requests/${id}/resolve`, { resolutionNote })
    }
}

export default new ServiceRequestsService()
