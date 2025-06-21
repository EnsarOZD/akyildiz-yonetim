import { defineStore } from 'pinia'
import { ref } from 'vue'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const role = ref(null)
  const companyId = ref(null)
  const fullName = ref(null)
  const email = ref(null)
  const isInitialized = ref(false) // 🔄 Firebase tamamlandı mı?

  async function fetchUserProfile(userParam) {
    const currentUser = userParam || auth.currentUser
    if (!currentUser) return

    const docRef = doc(db, 'users', currentUser.uid)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      user.value = currentUser
      role.value = data.role
      companyId.value = data.companyId
      fullName.value = `${data.firstName} ${data.lastName}`
      email.value = data.email
    }

    isInitialized.value = true
  }

  // 👇 Bu fonksiyon App.vue'de çağrılmalı
  function initAuthListener() {
    onAuthStateChanged(auth, async (u) => {
      if (u) {
        await fetchUserProfile(u)
      } else {
        clearUser()
        isInitialized.value = true
      }
    })
  }

  function clearUser() {
    user.value = null
    role.value = null
    companyId.value = null
    fullName.value = null
    email.value = null
  }

  return {
    user,
    role,
    companyId,
    fullName,
    email,
    isInitialized,
    fetchUserProfile,
    clearUser,
    initAuthListener
  }
})
