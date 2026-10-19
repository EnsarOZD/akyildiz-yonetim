import apiService from './api.js'

// Not: Hatalar artık yutulmuyor; diğer servislerde olduğu gibi çağırana iletilir.
class UsersService {
  // Tüm kullanıcıları getir
  async getUsers(filters = {}) {
    return await apiService.get('/users', filters)
  }

  // ID'ye göre kullanıcı getir
  async getUserById(id) {
    return await apiService.get(`/users/${id}`)
  }

  // Yeni kullanıcı oluştur
  async createUser(data) {
    return await apiService.post('/users', data)
  }

  // Kullanıcı güncelle
  async updateUser(id, data) {
    return await apiService.put(`/users/${id}`, data)
  }

  // Kullanıcı sil
  async deleteUser(id) {
    return await apiService.delete(`/users/${id}`)
  }

  // Şifre sıfırla
  async resetPassword(id) {
    return await apiService.post(`/users/${id}/reset-password`, {})
  }

  async getRoles() {
    return await apiService.get('/users/roles')
  }
}

export default new UsersService()
