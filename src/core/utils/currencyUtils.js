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

export const parseCurrency = (value) => {
  if (value === null || value === undefined || value === '') return 0
  const str = String(value)
    .replace(/[₺\s]/g, '')   // ₺ ve boşlukları kaldır
    .replace(/\./g, '')        // binlik ayracı (TR: nokta) kaldır
    .replace(',', '.')         // ondalık ayracı (TR: virgül → nokta)
  const num = parseFloat(str)
  return isNaN(num) ? 0 : num
}

export const formatInputCurrency = (value) => {
  if (value === undefined || value === null || value === '') return ''
  const num = typeof value === 'string' ? parseCurrency(value) : Number(value)
  if (isNaN(num) || num === 0) return ''
  return num.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
