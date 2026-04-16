// src/constants/enums.js

// ---------- PAYMENT / DEBT ----------
export const PAYMENT_TYPES = [
  { value: 0, slug: 'rent', label: 'Kira', icon: '🏠' },
  { value: 1, slug: 'dues', label: 'Aidat', icon: '🧾' },
  { value: 2, slug: 'utility', label: 'Fatura / Gider', icon: '🧾' },
  { value: 3, slug: 'other', label: 'Diğer', icon: '📦' },
];

export const DEBT_TYPES = [
  { value: 0, slug: 'dues', label: 'Aidat', icon: '🧾' },
  { value: 1, slug: 'electricity', label: 'Elektrik', icon: '⚡️' },
  { value: 2, slug: 'water', label: 'Su', icon: '💧' },
  { value: 3, slug: 'gas', label: 'Doğalgaz', icon: '🔥' },
];

export const PAYMENT_STATUSES = [
  { value: 0, slug: 'pending', label: 'Beklemede' },
  { value: 1, slug: 'completed', label: 'Tamamlandı' },
  { value: 2, slug: 'canceled', label: 'İptal Edildi' },
];

export const PAYMENT_METHODS = [
  { value: 0, slug: 'cash', label: 'Nakit' },
  { value: 1, slug: 'bank-transfer', label: 'Banka Havalesi / EFT' },
  { value: 2, slug: 'credit-card', label: 'Kredi Kartı' },
];

export const DEBT_STATUSES = [
  { value: 0, slug: 'unpaid', label: 'Ödenmedi' },
  { value: 1, slug: 'partial', label: 'Kısmi Ödendi' },
  { value: 2, slug: 'paid', label: 'Tam Ödendi' },
];

// ---------- AUDIT / ENTITY ----------
export const AUDIT_ACTIONS = [
  { value: 'Create', label: 'Oluşturuldu' },
  { value: 'Update', label: 'Güncellendi' },
  { value: 'Delete', label: 'Silindi' },
  { value: 'Payment', label: 'Ödeme' },
  { value: 'DebtAllocation', label: 'Borç Eşleştirme' },
  { value: 'AdvanceUsage', label: 'Avans Kullanımı' },
];

export const ENTITY_TYPES = [
  { value: 'Payment', label: 'Ödeme' },
  { value: 'UtilityDebt', label: 'Borç' },
  { value: 'AdvanceAccount', label: 'Avans Hesabı' },
  { value: 'Tenant', label: 'Kiracı' },
  { value: 'Owner', label: 'Mal Sahibi' },
  { value: 'Flat', label: 'Daire' },
];

// ---------- EXPENSE (Gider) ----------
export const EXPENSE_TYPES = [
  { value: 'Electricity', label: 'Elektrik (Genel)', icon: '⚡️' },
  { value: 'Water', label: 'Su (Genel)', icon: '💧' },
  { value: 'Gas', label: 'Gaz', icon: '🔥' },
  { value: 'Maintenance', label: 'Bakım', icon: '🛠️' },
  { value: 'Cleaning', label: 'Temizlik', icon: '🧹' },
  { value: 'Security', label: 'Güvenlik', icon: '🔒' },
  { value: 'FoodAndBeverage', label: 'Yeme/İçme', icon: '🍔' },
  { value: 'Salary', label: 'Maaş', icon: '💵' },
  { value: 'Tax', label: 'Vergi', icon: '📄' },
  { value: 'Other', label: 'Diğer', icon: '📦' },
];

// ---------- FLATS (Ünite) ----------
export const FLAT_CATEGORIES = [
  { value: 'Office', label: 'Ofis' },
  { value: 'Shop', label: 'Dükkan' },
  { value: 'Depot', label: 'Depo' },
  { value: 'Other', label: 'Diğer' },
];

// ---------- UTIL ----------
const toMaps = (arr) => ({
  byValue: Object.fromEntries(arr.map(x => [String(x.value), x])),
  bySlug: Object.fromEntries(arr.map(x => [String(x.slug ?? x.value).toLowerCase(), x])),
});
const normNum = (v) => { if (v === '' || v === null || v === undefined) return null; const n = Number(v); return Number.isFinite(n) ? n : null; };
const normSlug = (v) => String(v ?? '').toLowerCase();

const PT = toMaps(PAYMENT_TYPES);
const DT = toMaps(DEBT_TYPES);
const PS = toMaps(PAYMENT_STATUSES);
const DS = toMaps(DEBT_STATUSES);
const AA = toMaps(AUDIT_ACTIONS);
const ET = toMaps(ENTITY_TYPES);
const EX = toMaps(EXPENSE_TYPES);
const FC = toMaps(FLAT_CATEGORIES);
const PM = toMaps(PAYMENT_METHODS);

const pickFromList = (list, maps, v) => {
  const n = normNum(v);
  if (n != null && list[n]) return list[n];                 // dizin üzerinden (0,1,2…)
  const key = String(v);
  return maps.byValue[key] || maps.bySlug[normSlug(v)] || null; // value veya slug
};

// ---------- Payment helpers ----------
export const paymentTypeOptions = PAYMENT_TYPES.map(({ slug, label, icon }) => ({ value: slug, label, icon }));

export function getPaymentTypeLabel(v) {
  const it = pickFromList(PAYMENT_TYPES, PT, v);
  return it?.label ?? 'Bilinmeyen';
}
export function getPaymentTypeIcon(v) {
  const it = pickFromList(PAYMENT_TYPES, PT, v);
  return it?.icon ?? '📦';
}
export function getPaymentTypeSlug(v) {
  const it = pickFromList(PAYMENT_TYPES, PT, v);
  return it?.slug ?? 'other';
}
export function paymentTypeToValue(v) {
  const it = pickFromList(PAYMENT_TYPES, PT, v);
  return it?.value ?? null;
}

// ---------- Debt helpers ----------
export const debtTypeOptions = DEBT_TYPES.map(({ slug, label, icon }) => ({ value: slug, label, icon }));

export function getDebtTypeLabel(v) {
  const it = pickFromList(DEBT_TYPES, DT, v);
  return it?.label ?? 'Bilinmeyen';
}
export function getDebtTypeIcon(v) {
  const it = pickFromList(DEBT_TYPES, DT, v);
  return it?.icon ?? '🧾';
}
export function debtTypeToValue(v) {
  const it = pickFromList(DEBT_TYPES, DT, v);
  return it?.value ?? null;
}

// ---------- Status helpers ----------
export function getPaymentStatusLabel(v) {
  const it = pickFromList(PAYMENT_STATUSES, PS, v);
  return it?.label ?? 'Bilinmeyen';
}
export function getDebtStatusLabel(v) {
  const it = pickFromList(DEBT_STATUSES, DS, v);
  return it?.label ?? 'Bilinmeyen';
}

export function getPaymentMethodLabel(v) {
  const it = pickFromList(PAYMENT_METHODS, PM, v);
  return it?.label ?? 'Nakit';
}

// ---------- Audit / Entity helpers ----------
export function getAuditActionLabel(v) {
  const it = pickFromList(AUDIT_ACTIONS, AA, v);
  return it?.label ?? String(v);
}
export function getEntityTypeLabel(v) {
  const it = pickFromList(ENTITY_TYPES, ET, v);
  return it?.label ?? String(v);
}

// ---------- Expense helpers ----------
export const expenseTypeOptions = EXPENSE_TYPES.map(({ value, label, icon }) => ({ value, label, icon }));

export function getExpenseTypeString(v) {
  // Kanonik değer (örn. 'Electricity') döndürür
  const it = pickFromList(EXPENSE_TYPES, EX, v);
  return it?.value ?? 'Other';
}
export function getExpenseTypeName(v) {
  const it = pickFromList(EXPENSE_TYPES, EX, v);
  return it?.label ?? String(v);
}
export function getExpenseIcon(v) {
  const it = pickFromList(EXPENSE_TYPES, EX, v);
  return it?.icon ?? '📦';
}

// ---------- Flat helpers ----------
export function getCategoryLabel(v) {
  const it = pickFromList(FLAT_CATEGORIES, FC, v);
  return it?.label ?? String(v);
}

// ---------- BACKWARD COMPAT (eski importları bozma) ----------
export const paymentTypes = Object.fromEntries(PAYMENT_TYPES.map(x => [x.value, x.label]));
export const debtTypes = Object.fromEntries(DEBT_TYPES.map(x => [x.value, x.label]));
export const paymentStatuses = Object.fromEntries(PAYMENT_STATUSES.map(x => [x.value, x.label]));
export const debtStatuses = Object.fromEntries(DEBT_STATUSES.map(x => [x.value, x.label]));
export const auditActions = Object.fromEntries(AUDIT_ACTIONS.map(x => [x.value, x.label]));
export const entityTypes = Object.fromEntries(ENTITY_TYPES.map(x => [x.value, x.label]));

// Payments.vue ve diğerleri için var olan isimle uyumluluk:
export function getPaymentTypeString(v) { return getPaymentTypeSlug(v); }
