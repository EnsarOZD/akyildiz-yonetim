// Mock data — Akyıldız İş Merkezi (gerçek kiracı adlarıyla)

const TENANTS = [
  { id: 1, name: 'GALORE GIDA TİCARET LİMİTED ŞİRKETİ', short: 'Galore Gıda', unit: '8-A', rep: 'Mehmet Yılmaz', phone: '0532 441 28 19', category: 'Gıda', since: '2022', balance: 285411.37, status: 'active', avatar: 'G', color: '#F43F5E' },
  { id: 2, name: 'GEOSANTE SAĞLIK ANONİM ŞİRKETİ', short: 'Geosante', unit: '2', rep: 'Dr. Aylin Doğan', phone: '0533 289 71 44', category: 'Sağlık', since: '2020', balance: 364417.79, status: 'active', avatar: 'G', color: '#6B8AFF' },
  { id: 3, name: 'İHC DANIŞMANLIK HİZMETLERİ SAĞLIK TURİZMİ VE TİCARET LİMİTED ŞİRKETİ', short: 'İHC Danışmanlık', unit: '-1, 5, 9', rep: 'Kemal Arslan', phone: '0535 772 13 56', category: 'Danışmanlık', since: '2019', balance: 688117.82, status: 'active', avatar: 'İ', color: '#6B8AFF' },
  { id: 4, name: 'RESULT TURİZM GAYRİMENKUL DANIŞMANLIK LİMİTED ŞİRKETİ', short: 'Result Turizm', unit: '7', rep: 'Serap Kılıç', phone: '0542 198 34 27', category: 'Turizm', since: '2021', balance: 488279.90, status: 'active', avatar: 'R', color: '#8B5CF6' },
  { id: 5, name: 'SAPPHİRE ÖZEL SAĞLIK HİZMETLERİ TURİZM VE TİCARET A.Ş', short: 'Sapphire Sağlık', unit: '3-B, 6', rep: 'Dr. Can Öztürk', phone: '0536 625 09 81', category: 'Sağlık', since: '2022', balance: 183942.49, status: 'active', avatar: 'S', color: '#6B8AFF' },
  { id: 6, name: 'SERKAN GÜL', short: 'Serkan Gül', unit: '-4', rep: 'Serkan Gül', phone: '0505 314 82 67', category: 'Bireysel', since: '2023', balance: 101810.15, status: 'active', avatar: 'S', color: '#FBBF24' },
];

// Aylık gelir/gider — gerçek aya göre
const MONTHLY = [
  { month: 'Kas', income: 6200000, expense: 980000 },
  { month: 'Ara', income: 1250000, expense: 1120000 },
  { month: 'Oca', income: 3800000, expense: 145000 },
  { month: 'Şub', income: 6450000, expense: 115000 },
  { month: 'Mar', income: 4950000, expense: 1010000 },
  { month: 'Nis', income: 450000, expense: 89500 },
];

const OVERDUE = [
  { tenant: 'İHC DANIŞMANLIK HİZMETLERİ SAĞLIK TURİZMİ VE TİCARET LİMİTED ŞİRKETİ', type: 'Elektrik', amount: 11212.65, date: '10 Nis 2026' },
  { tenant: 'SAPPHİRE ÖZEL SAĞLIK HİZMETLERİ TURİZM VE TİCARET A.Ş', type: 'Elektrik', amount: 44802.57, date: '10 Nis 2026' },
  { tenant: 'İHC DANIŞMANLIK HİZMETLERİ SAĞLIK TURİZMİ VE TİCARET LİMİTED ŞİRKETİ', type: 'Elektrik', amount: 17684.50, date: '10 Nis 2026' },
  { tenant: 'GEOSANTE SAĞLIK ANONİM ŞİRKETİ', type: 'Elektrik', amount: 52338.59, date: '10 Nis 2026' },
  { tenant: 'SERKAN GÜL', type: 'Elektrik', amount: 15078.39, date: '10 Nis 2026' },
  { tenant: 'GALORE GIDA TİCARET LİMİTED ŞİRKETİ', type: 'Aidat', amount: 43113.41, date: '25 Nis 2026' },
  { tenant: 'RESULT TURİZM GAYRİMENKUL DANIŞMANLIK LİMİTED ŞİRKETİ', type: 'Aidat', amount: 43113.41, date: '25 Nis 2026' },
];

const PAYMENTS_RECENT = [
  { tenant: 'SAPPHİRE ÖZEL SAĞLIK HİZMETLERİ TURİZM VE TİCARET A.Ş', date: '17 Nis 2026', doc: 'Fatura (2026/04)', amount: 10.89 },
  { tenant: 'SAPPHİRE ÖZEL SAĞLIK HİZMETLERİ TURİZM VE TİCARET A.Ş', date: '17 Nis 2026', doc: 'Fatura (2026/04)', amount: 6180.00 },
  { tenant: 'SAPPHİRE ÖZEL SAĞLIK HİZMETLERİ TURİZM VE TİCARET A.Ş', date: '17 Nis 2026', doc: 'Fatura (2026/04)', amount: 6180.00 },
  { tenant: 'SAPPHİRE ÖZEL SAĞLIK HİZMETLERİ TURİZM VE TİCARET A.Ş', date: '17 Nis 2026', doc: 'Fatura (2026/04)', amount: 18266.81 },
  { tenant: 'SAPPHİRE ÖZEL SAĞLIK HİZMETLERİ TURİZM VE TİCARET A.Ş', date: '17 Nis 2026', doc: 'Fatura (2026/04)', amount: 13575.74 },
  { tenant: 'İHC DANIŞMANLIK HİZMETLERİ SAĞLIK TURİZMİ VE TİCARET LİMİTED ŞİRKETİ', date: '17 Nis 2026', doc: 'Fatura (2026/04)', amount: 14781.11 },
  { tenant: 'İHC DANIŞMANLIK HİZMETLERİ SAĞLIK TURİZMİ VE TİCARET LİMİTED ŞİRKETİ', date: '17 Nis 2026', doc: 'Fatura (2026/04)', amount: 64199.61 },
  { tenant: 'İHC DANIŞMANLIK HİZMETLERİ SAĞLIK TURİZMİ VE TİCARET LİMİTED ŞİRKETİ', date: '17 Nis 2026', doc: 'Fatura (2026/04)', amount: 1261.82 },
  { tenant: 'İHC DANIŞMANLIK HİZMETLERİ SAĞLIK TURİZMİ VE TİCARET LİMİTED ŞİRKETİ', date: '17 Nis 2026', doc: 'Fatura (2026/04)', amount: 660.00 },
  { tenant: 'İHC DANIŞMANLIK HİZMETLERİ SAĞLIK TURİZMİ VE TİCARET LİMİTED ŞİRKETİ', date: '17 Nis 2026', doc: 'Fatura (2026/04)', amount: 121140.27 },
];

const EXPENSES = [
  { title: 'TES.NO.1428452000', date: '01.01.2026', type: 'Elektrik (Genel)', amount: 273650.00 },
  { title: 'İçme suyu', date: '25.02.2026', type: 'Su', amount: 1060.00 },
  { title: 'YAVUZ SELİM OK-ASANSÖR BAKIM', date: '13.02.2026', type: 'Bakım', amount: 6600.00 },
  { title: 'CK BOĞAZİÇİ-', date: '15.02.2026', type: 'Elektrik (Genel)', amount: 289.46 },
  { title: 'CK BOĞAZİÇİ', date: '15.02.2026', type: 'Elektrik (Genel)', amount: 3163.31 },
  { title: '12/2025 Kurum Elektrik Faturası', date: '31.12.2025', type: 'Elektrik (Genel)', amount: 235825.00 },
  { title: 'Kurum Elektrik Faturası(Gecikme Bedeli)', date: '22.12.2025', type: 'Elektrik (Genel)', amount: 2697.52 },
  { title: 'SU ALIMI', date: '22.12.2025', type: 'Su', amount: 585.00 },
  { title: 'HORTUM ALIMI', date: '21.12.2025', type: 'Bakım', amount: 4489.07 },
  { title: 'PERSONEL YEMEK', date: '20.12.2025', type: 'Yemek/İçme', amount: 22800.00 },
];

const EXPENSE_CATEGORIES = [
  { label: 'Elektrik (Genel)', amount: 2264695.14, count: 21 },
  { label: 'Maaş', amount: 1379650.31, count: 11 },
  { label: 'Vergi', amount: 539281.14, count: 7 },
  { label: 'Yemek/İçme', amount: 247813.55, count: 14 },
  { label: 'Diğer', amount: 241319.22, count: 18 },
  { label: 'Bakım', amount: 65038.54, count: 9 },
  { label: 'Temizlik', amount: 22691.07, count: 11 },
];

const DEBTS = [
  { tenant: 'Akyıldızlar', unit: '2026/04', due: '14.05.2026', amount: 100, status: 'Bekliyor', type: 'aidat' },
  { tenant: 'RESULT TURİZM GAYRİMENKUL DANIŞMANLIK LİMİTED ŞİRKETİ', unit: '2026/04', due: '25.04.2026', amount: 43113.41, status: 'Bekliyor', type: 'aidat' },
  { tenant: 'Akyıldızlar', unit: '2026/04', due: '25.04.2026', amount: 7543.73, status: 'Bekliyor', type: 'aidat' },
  { tenant: 'SAPPHİRE ÖZEL SAĞLIK HİZMETLERİ TURİZM VE TİCARET A.Ş', unit: '2026/04', due: '25.04.2026', amount: 43113.41, status: 'Bekliyor', type: 'aidat' },
  { tenant: 'İHC DANIŞMANLIK HİZMETLERİ SAĞLIK TURİZMİ VE TİCARET LİMİTED ŞİRKETİ', unit: '2026/04', due: '25.04.2026', amount: 43113.41, status: 'Bekliyor', type: 'aidat' },
  { tenant: 'Akyıldızlar', unit: '2026/04', due: '25.04.2026', amount: 43113.41, status: 'Bekliyor', type: 'aidat' },
  { tenant: 'SAPPHİRE ÖZEL SAĞLIK HİZMETLERİ TURİZM VE TİCARET A.Ş', unit: '2026/04', due: '25.04.2026', amount: 21556.70, status: 'Bekliyor', type: 'aidat' },
  { tenant: 'Akyıldızlar', unit: '2026/04', due: '25.04.2026', amount: 21556.70, status: 'Bekliyor', type: 'aidat' },
  { tenant: 'GEOSANTE SAĞLIK ANONİM ŞİRKETİ', unit: '2026/04', due: '25.04.2026', amount: 43113.41, status: 'Bekliyor', type: 'aidat' },
  { tenant: 'İHC DANIŞMANLIK HİZMETLERİ SAĞLIK TURİZMİ VE TİCARET LİMİTED ŞİRKETİ', unit: '2026/04', due: '25.04.2026', amount: 43113.41, status: 'Bekliyor', type: 'aidat' },
];

// Üniteler — gerçek yapıya göre (kat bazlı)
const UNITS = [
  { id: '7', label: '7', floor: '7. Kat', type: 'Floor', status: 'Aktif', filled: 'Dolu', area: 180, color: '#F97316' },
  { id: '6', label: '6', floor: '6. Kat', type: 'Floor', status: 'Aktif', filled: 'Dolu', area: 180, color: '#F97316' },
  { id: '5', label: '5', floor: '5. Kat', type: 'Floor', status: 'Aktif', filled: 'Dolu', area: 180, color: '#F97316' },
  { id: '4', label: '4', floor: '4. Kat', type: 'Floor', status: 'Aktif', filled: 'Boş', area: 180, color: '#10B981' },
  { id: '3-B', label: '3-B', floor: '3. Kat', type: 'Floor', status: 'Aktif', filled: 'Dolu', area: 180, color: '#F97316' },
  { id: '3-A', label: '3-A', floor: '3. Kat', type: 'Floor', status: 'Aktif', filled: 'Dolu', area: 180, color: '#F97316' },
  { id: '2', label: '2', floor: '2. Kat', type: 'Floor', status: 'Aktif', filled: 'Dolu', area: 180, color: '#F97316' },
  { id: '1', label: '1', floor: '1. Kat', type: 'Floor', status: 'Aktif', filled: 'Dolu', area: 180, color: '#F97316' },
  { id: '0-A', label: '0-A', floor: 'Zemin', type: 'Floor', status: 'Aktif', filled: 'Dolu', area: 180, color: '#F97316' },
  { id: '0-B', label: '0-B', floor: 'Zemin', type: 'Giriş', status: 'Aktif', filled: 'Dolu', area: 180, color: '#06B6D4' },
  { id: '-1', label: '-1', floor: 'B1', type: 'Otopark', status: 'Aktif', filled: 'Dolu', area: 450, color: '#06B6D4' },
  { id: '-2', label: '-2', floor: 'B2', type: 'Otopark', status: 'Aktif', filled: 'Dolu', area: 450, color: '#06B6D4' },
  { id: '-4', label: '-4', floor: 'B4', type: 'Depo', status: 'Aktif', filled: 'Dolu', area: 120, color: '#06B6D4' },
];

// Ünite chip (profilim sayfası)
const UNIT_CHIPS = ['3-B', '3-A', '0-A', '-2', '4', '5', '6', '7', '1', '-4', '-1', '0-B', 'BİNA OTOPARK'];

window.MOCK = { TENANTS, MONTHLY, OVERDUE, PAYMENTS_RECENT, EXPENSES, EXPENSE_CATEGORIES, DEBTS, UNITS, UNIT_CHIPS };
