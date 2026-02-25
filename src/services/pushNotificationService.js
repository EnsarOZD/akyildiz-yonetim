import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export const pushNotificationService = {
    async requestPermission() {
        if (!('Notification' in window)) {
            console.warn('This browser does not support notifications.')
            return false
        }

        const permission = await Notification.requestPermission()
        return permission === 'granted'
    },

    async subscribeUser() {
        if (!('serviceWorker' in navigator)) return

        try {
            const registration = await navigator.serviceWorker.ready

            // Public VAPID Key from backend
            // In a real app, fetch this from an endpoint or env
            const publicVapidKey = 'BFmS_K7B4m8R_Y_8T_S5_P_B_Q_G_Z_L_M_X_G_K_Q' // Example

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
            })

            const payload = {
                endpoint: subscription.endpoint,
                p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')))),
                auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth'))))
            }

            await axios.post(`${API_BASE_URL}/api/notifications/subscribe`, payload)
            console.log('User is subscribed to push notifications.')
        } catch (err) {
            console.error('Failed to subscribe the user: ', err)
        }
    },

    async unsubscribeUser() {
        // Implementation for unsubscription...
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
