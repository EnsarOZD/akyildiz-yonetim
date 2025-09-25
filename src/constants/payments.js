// Backend enum'larıyla uyumlu ödeme tipleri
export const paymentTypeMap = [
  'Aidat',      // 0 - Aidat
  'Elektrik',   // 1 - Elektrik
  'Su',         // 2 - Su
  'Doğalgaz',   // 3 - Doğalgaz
  'Diğer'       // 4 - Diğer
]

export const paymentTypeOptions = [
  { value: 'Aidat', label: 'Aidat', icon: '🏢' },
  { value: 'Elektrik', label: 'Elektrik', icon: '⚡️' },
  { value: 'Su', label: 'Su', icon: '💧' },
  { value: 'Doğalgaz', label: 'Doğalgaz', icon: '🔥' },
  { value: 'Diğer', label: 'Diğer', icon: '📦' }
]

export function getPaymentTypeSlug(type) {
  if (typeof type === 'number' && paymentTypeMap[type]) {
    return paymentTypeMap[type]
  }
  if (typeof type === 'string' && paymentTypeMap.includes(type)) {
    return type
  }
  return 'Other'
}

export function getPaymentTypeLabel(type) {
  const str = getPaymentTypeString(type)
  const opt = paymentTypeOptions.find(o => o.value === str)
  return opt ? opt.label : str
}

export function getPaymentTypeIcon(type) {
  const str = getPaymentTypeString(type)
  const opt = paymentTypeOptions.find(o => o.value === str)
  return opt ? opt.icon : '❓'
} 