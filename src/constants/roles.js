// src/constants/roles.js

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  OWNER: 'owner',
  TENANT: 'tenant',
  OBSERVER: 'observer',
  DATA_ENTRY: 'dataentry'
}

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Sistem Yöneticisi',
  [ROLES.MANAGER]: 'Yönetici (Müdür)',
  [ROLES.OWNER]: 'Mal Sahibi',
  [ROLES.TENANT]: 'Kiracı',
  [ROLES.OBSERVER]: 'Gözlemci (Avukat vb.)',
  [ROLES.DATA_ENTRY]: 'Veri Giriş Sorumlusu'
}
