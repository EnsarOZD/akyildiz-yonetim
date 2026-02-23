/**
 * UI Yardımcı Fonksiyonları
 */

/**
 * Para birimi formatlar (₺)
 * @param {number|string} value 
 * @returns {string}
 */
export const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) {
    return '₺0,00'
  }
  return Number(value).toLocaleString('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

/**
 * İsimden avatar rengi üretir
 * @param {string} name 
 * @returns {string} Tailwind class
 */
export const getAvatarColor = (name) => {
  if (!name) return 'bg-gray-500'
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 
    'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 
    'bg-indigo-500', 'bg-teal-500', 'bg-orange-500'
  ]
  const hash = String(name).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

/**
 * İsimden avatar baş harfi üretir
 * @param {string} name 
 * @param {number} length 
 * @returns {string}
 */
export const getAvatarInitial = (name, length = 1) => {
  if (!name) return '?'
  return name.substring(0, length).toUpperCase()
}
