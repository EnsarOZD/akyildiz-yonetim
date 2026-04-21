import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { notificationsService } from '@/infrastructure/services/notificationsService'

export const useNotificationsStore = defineStore('notifications', () => {
    const items = ref([])
    const unreadCount = ref(0)
    const totalCount = ref(0)
    const loading = ref(false)
    const lastFetched = ref(null)
    const pendingPromise = ref(null)
    const TTL_MS = 60 * 1000 // 1 dakika

    const unreadItems = computed(() => items.value.filter(n => !n.isRead))
    const latestAnnouncement = computed(() => items.value.find(n => n.type === 'Announcement'))

    async function refresh(force = false) {
        if (!force && items.value.length > 0 && lastFetched.value && (Date.now() - lastFetched.value < TTL_MS)) {
            return
        }
        if (pendingPromise.value) {
            return pendingPromise.value
        }

        loading.value = true
        pendingPromise.value = (async () => {
            try {
                const data = await notificationsService.getNotifications(false, 20, 0)
                items.value = data.items || []
                totalCount.value = data.totalCount || 0
                unreadCount.value = data.unreadCount || 0
                lastFetched.value = Date.now()
            } catch (error) {
                console.error('Failed to refresh notifications:', error)
            } finally {
                loading.value = false
                pendingPromise.value = null
            }
        })()

        return pendingPromise.value
    }

    async function fetchMore() {
        if (items.value.length >= totalCount.value) return

        loading.value = true
        try {
            const data = await notificationsService.getNotifications(false, 20, items.value.length)
            items.value = [...items.value, ...(data.items || [])]
            totalCount.value = data.totalCount || totalCount.value
            unreadCount.value = data.unreadCount || unreadCount.value
        } catch (error) {
            console.error('Failed to fetch more notifications:', error)
        } finally {
            loading.value = false
        }
    }

    async function markAsRead(id) {
        try {
            await notificationsService.markAsRead(id)
            const item = items.value.find(n => n.id === id)
            if (item && !item.isRead) {
                item.isRead = true
                unreadCount.value = Math.max(0, unreadCount.value - 1)
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error)
        }
    }

    async function markAllAsRead() {
        try {
            await notificationsService.markAllAsRead()
            items.value.forEach(n => n.isRead = true)
            unreadCount.value = 0
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error)
        }
    }

    async function deleteAll() {
        await notificationsService.deleteAll()
        items.value = []
        unreadCount.value = 0
        totalCount.value = 0
    }

    return {
        items,
        unreadCount,
        totalCount,
        loading,
        unreadItems,
        refresh,
        fetchMore,
        markAsRead,
        markAllAsRead,
        deleteAll
    }
})
