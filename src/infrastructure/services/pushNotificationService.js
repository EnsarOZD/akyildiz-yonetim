import apiService from './api.js'

let cachedVapidKey = null

export const pushNotificationService = {
    isSupported() {
        return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
    },

    getPermission() {
        return Notification.permission
    },

    async isSubscribed() {
        if (!this.isSupported()) return false
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        return subscription !== null
    },

    async requestPermission() {
        if (!this.isSupported()) return 'denied'
        return await Notification.requestPermission()
    },

    async subscribeUser() {
        if (!this.isSupported()) return null

        try {
            const registration = await navigator.serviceWorker.ready

            // Fetch VAPID public key from backend if not cached
            if (!cachedVapidKey) {
                const response = await apiService.get('/notifications/vapid-public-key')
                cachedVapidKey = response.publicKey
            }

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(cachedVapidKey)
            })

            const payload = {
                endpoint: subscription.endpoint,
                p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')))),
                auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth'))))
            }

            await apiService.post('/notifications/subscribe', payload)
            console.log('User is subscribed to push notifications.')
            return subscription
        } catch (err) {
            console.error('Failed to subscribe the user: ', err)
            throw err
        }
    },

    async unsubscribeUser() {
        if (!this.isSupported()) return

        try {
            const registration = await navigator.serviceWorker.ready
            const subscription = await registration.pushManager.getSubscription()

            if (subscription) {
                const endpoint = subscription.endpoint
                await subscription.unsubscribe()
                await apiService.delete(`/notifications/unsubscribe?endpoint=${encodeURIComponent(endpoint)}`)
                console.log('User is unsubscribed from push notifications.')
            }
        } catch (err) {
            console.error('Failed to unsubscribe the user: ', err)
            throw err
        }
    }
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}
