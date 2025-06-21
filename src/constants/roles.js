// src/constants/roles.js

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  DATA_ENTRY: 'dataEntry',
  VIEWER: 'viewer',
  TENANT: 'tenant',
}

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.MANAGER]: 'Yönetici',
  [ROLES.DATA_ENTRY]: 'Veri Giriş Sorumlusu',
  [ROLES.VIEWER]: 'Gözlemci (Avukat / Mal Sahibi)',
  [ROLES.TENANT]: 'Kiracı',
}
