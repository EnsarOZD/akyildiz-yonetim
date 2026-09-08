export const UNIT_OPTIONS = [
  "-3. Kat ve -4. Kat","-1. Kat", "Zemin Kat A","Zemin Kat B", "1. Kat", "2. Kat A","2. Kat B", "3. Kat", 
  "4. Kat", "5. Kat", "6. Kat", "7. Kat",   
];

// Flat kategorileri
export const FLAT_CATEGORIES = [
  { value: 'Office', label: 'Ofis' },
  { value: 'Shop', label: 'Dükkan' },
  { value: 'Warehouse', label: 'Depo' },
  { value: 'Restaurant', label: 'Restoran' },
  { value: 'Service', label: 'Hizmet' },
  { value: 'Other', label: 'Diğer' }
];

// İş türleri
export const BUSINESS_TYPES = [
  { value: 'Ticaret', label: 'Ticaret' },
  { value: 'Hizmet', label: 'Hizmet' },
  { value: 'Üretim', label: 'Üretim' },
  { value: 'Ofis', label: 'Ofis' },
  { value: 'Depo', label: 'Depo' },
  { value: 'Diğer', label: 'Diğer' }
];

// Firma türleri
export const COMPANY_TYPES = [
  { value: 'Individual', label: 'Şahıs Firması' },
  { value: 'Corporate', label: 'Tüzel Kişi' }
];

// Ünite tipi (backend UnitType enum'u).
// API enum'ları JsonStringEnumConverter ile string olarak döndürüyor
// ("Floor" | "Entry" | "Parking"), formlar ise 0/1/2 sayısal değer gönderiyor.
// Bu yüzden her iki gösterim de desteklenir.
export const UNIT_TYPE = { FLOOR: 'Floor', ENTRY: 'Entry', PARKING: 'Parking' };

const UNIT_TYPE_LABELS = {
  0: 'Kat',      Floor: 'Kat',
  1: 'Giriş',    Entry: 'Giriş',
  2: 'Otopark',  Parking: 'Otopark'
};

export function unitTypeLabel (type, fallback = 'Bilinmiyor') {
  if (type === null || type === undefined || type === '') return fallback;
  return UNIT_TYPE_LABELS[type] ?? fallback;
}

export const isParkingType = (type) => type === 2 || type === UNIT_TYPE.PARKING;
export const isEntryType   = (type) => type === 1 || type === UNIT_TYPE.ENTRY;

// Sayısal forma indirger (filtre/karşılaştırma için). Bilinmeyen değerde null.
export function unitTypeValue (type) {
  if (type === 0 || type === 1 || type === 2) return type;
  if (type === UNIT_TYPE.FLOOR) return 0;
  if (type === UNIT_TYPE.ENTRY) return 1;
  if (type === UNIT_TYPE.PARKING) return 2;
  const n = Number(type);
  return Number.isInteger(n) && n >= 0 && n <= 2 ? n : null;
}
