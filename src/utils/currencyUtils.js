/**
 * Para birimi formatlama yardımcı fonksiyonları
 */

/**
 * Sayıyı para birimi formatına çevirir (binlik ayırıcı ile)
 * @param {number|string} value - Formatlanacak değer
 * @param {boolean} includeSymbol - ₺ sembolü eklensin mi?
 * @returns {string} Formatlanmış para birimi stringi
 */
export const formatCurrency = (value, includeSymbol = true) => {
    if (value === null || value === undefined || value === '') return includeSymbol ? '0,00 ₺' : '0,00'

    const num = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value

    if (isNaN(num)) return includeSymbol ? '0,00 ₺' : '0,00'

    const formatted = new Intl.NumberFormat('tr-TR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num)

    return includeSymbol ? `${formatted} ₺` : formatted
}

/**
 * Formatlı stringi sayıya çevirir
 * @param {string} value - Formatlı string (örn: "1.250,50")
 * @returns {number} Sayısal değer
 */
export const parseCurrency = (value) => {
    if (!value) return 0

    // Binlik ayırıcıları (nokta) kaldır, ondalık ayırıcıyı (virgül) noktaya çevir
    const cleanValue = value.toString()
        .replace(/\s/g, '')
        .replace(/₺/g, '')
        .split('.').join('')
        .replace(',', '.')

    const num = parseFloat(cleanValue)
    return isNaN(num) ? 0 : num
}

/**
 * Input girişi sırasında binlik ayırıcı ekleyen formatlayıcı
 * @param {string} value - Ham input değeri
 * @returns {string} Binlik ayırıcılı değer
 */
export const formatInputCurrency = (value) => {
    if (!value) return ''

    // Sadece rakamları ve virgülü al
    let cleanValue = value.toString().replace(/[^0-9,]/g, '')

    // Birden fazla virgülü engelle
    const parts = cleanValue.split(',')
    if (parts.length > 2) {
        cleanValue = parts[0] + ',' + parts.slice(1).join('')
    }

    const [integerPart, decimalPart] = cleanValue.split(',')

    // Binlik ayırıcı ekle
    const formattedInteger = integerPart ? new Intl.NumberFormat('tr-TR').format(parseInt(integerPart)) : ''

    return decimalPart !== undefined ? `${formattedInteger},${decimalPart.slice(0, 2)}` : formattedInteger
}
