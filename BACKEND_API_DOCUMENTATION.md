# Ortak Tüketim Dağıtımı - Backend API Dökümantasyonu

## Genel Bakış

Bu dökümantasyon, ortak alan ve mescit elektrik/su tüketimini aktif kiracılara hisse oranında dağıtmak için backend'de implement edilmesi gereken API endpoint'lerini açıklar.

## İş Akışı

```
1. Sistem Fiyatlarını Getir → 2. Ortak Tüketim Hesapla → 3. Sonuçları Kontrol Et → 4. Uygula ve Kaydet
```

---

## 1. Sistem Fiyatlandırma Bilgilerini Getir

### Endpoint
```http
GET /MeterReadings/pricing/{year}/{month}/{type}
```

### Parameters
- `year` (int): Dönem yılı (örn: 2025)
- `month` (int): Dönem ayı (1-12)
- `type` (int): Sayaç tipi (0=Elektrik, 1=Su)

### Response Format
```json
{
  "unitPrice": 2.50,
  "vatRate": 20.00,
  "btvRate": 5.00,
  "effectiveDate": "2025-01-01T00:00:00Z",
  "expiryDate": null,
  "description": "2025 yılı elektrik fiyatlandırması",
  "meterType": 0,
  "year": 2025,
  "month": 9
}
```

### Backend Gereksinimleri
- **Tablo**: `UtilityPricingConfigurations` (şu anda eksik)
- **Mantık**: Verilen yıl/ay/tip için aktif fiyatlandırma kaydını döndür
- **Fallback**: Eğer kayıt yoksa varsayılan değerler döndür

---

## 2. Ortak Tüketim Dağıtımını Hesapla

### Endpoint
```http
POST /MeterReadings/distribute-shared-consumption
```

### Request Body Format
```json
{
  "periodYear": 2025,
  "periodMonth": 9,
  "sharedAreaConsumption": 50.0,
  "mescitConsumption": 50.0,
  "consumptionType": "electricity"
}
```

**Not**: `consumptionType` alanı opsiyonel, varsayılan değer "electricity"

### Response Format
```json
[
  {
    "flatId": "2ac684f9-12bf-4fb0-83a5-d276e9ffd10c",
    "flatNumber": "5.KAT",
    "shareCount": 1,
    "distributedConsumption": 25.0,
    "consumptionType": "electricity"
  },
  {
    "flatId": "cdb379d6-d9ea-40b6-a783-3eda443d43bd",
    "flatNumber": "2.KAT", 
    "shareCount": 1,
    "distributedConsumption": 25.0,
    "consumptionType": "electricity"
  }
]
```

### Backend Gereksinimleri

#### 1. Aktif Kiracıları Bul
```sql
SELECT f.Id as FlatId, f.Code as FlatNumber, f.EffectiveShare as ShareCount
FROM Flats f 
WHERE f.IsOccupied = 1 AND f.IsActive = 1
```

#### 2. Toplam Hisse Hesapla
```sql
SELECT SUM(EffectiveShare) as TotalShares
FROM Flats 
WHERE IsOccupied = 1 AND IsActive = 1
```

#### 3. Dağıtım Hesapla
```
Toplam Tüketim = sharedAreaConsumption + mescitConsumption
Her Hisse Başına = Toplam Tüketim / Toplam Hisse
```

#### 4. Sonuç Formatla
Her aktif kiracı için:
- `flatId`: Flat ID
- `flatNumber`: Flat kodu (örn: "5.KAT")
- `shareCount`: Hisse sayısı (EffectiveShare)
- `distributedConsumption`: Hesaplanan tüketim
- `consumptionType`: Tüketim türü ("electricity", "water", "both")

---

## 3. Ortak Tüketimi Uygula ve Kaydet

### Endpoint
```http
POST /MeterReadings/apply-shared-consumption
```

### Request Body Format
```json
{
  "operationId": "shared-consumption-2025-9-1735045905000",
  "periodYear": 2025,
  "periodMonth": 9,
  "dueDate": "2025-10-15T00:00:00.000Z",
  "vatRate": 0,
  "btvRate": 0,
  "defaultUnitPrice": 0,
  "items": [
    {
      "flatId": "2ac684f9-12bf-4fb0-83a5-d276e9ffd10c",
      "shareCount": 1,
      "distributedConsumption": 25.0,
      "unitPrice": null
    },
    {
      "flatId": "cdb379d6-d9ea-40b6-a783-3eda443d43bd",
      "shareCount": 1,
      "distributedConsumption": 25.0,
      "unitPrice": null
    }
  ]
}
```

### Response Format
```json
{
  "operationId": "shared-consumption-2025-9-1735045905000",
  "createdMeterReadings": 4,
  "createdUtilityDebts": 4,
  "totalAmount": 312.50,
  "pricingUsed": {
    "unitPrice": 2.50,
    "vatRate": 20.00,
    "btvRate": 5.00,
    "effectiveDate": "2025-01-01T00:00:00Z",
    "description": "2025 yılı elektrik fiyatlandırması"
  },
  "createdItems": [
    {
      "flatId": "2ac684f9-12bf-4fb0-83a5-d276e9ffd10c",
      "flatNumber": "5.KAT",
      "meterReadingId": "meter-reading-id-1",
      "utilityDebtId": "utility-debt-id-1",
      "consumption": 25.0,
      "unitPrice": 2.50,
      "amount": 78.125
    }
  ]
}
```

### Backend Gereksinimleri

#### 1. Fiyatlandırma Bilgilerini Al
```sql
SELECT * FROM UtilityPricingConfigurations 
WHERE Year = @periodYear AND Month = @periodMonth AND MeterType = 0
```

#### 2. Her Item İçin İşlem Yap
```sql
-- 1. MeterReading Kaydı Oluştur
INSERT INTO MeterReadings (Id, FlatId, Type, PeriodYear, PeriodMonth, ReadingValue, Consumption, ReadingDate, Note)
VALUES (NEWID(), @flatId, 0, @periodYear, @periodMonth, @previousReading + @consumption, @consumption, @readingDate, 'Ortak tüketim dağıtımı')

-- 2. UtilityDebt Kaydı Oluştur
INSERT INTO UtilityDebts (Id, FlatId, Type, PeriodYear, PeriodMonth, Amount, Status, Description, TenantId, OwnerId)
VALUES (NEWID(), @flatId, 0, @periodYear, @periodMonth, @amount, 0, 'Ortak elektrik tüketimi', @tenantId, @ownerId)
```

#### 3. Maliyet Hesaplama
```
BaseAmount = distributedConsumption * unitPrice
VatAmount = BaseAmount * (vatRate / 100)
BtvAmount = BaseAmount * (btvRate / 100)
TotalAmount = BaseAmount + VatAmount + BtvAmount
```

#### 4. Response Hazırla
- `createdMeterReadings`: Oluşturulan meter reading sayısı
- `createdUtilityDebts`: Oluşturulan borç kaydı sayısı
- `totalAmount`: Toplam tutar
- `pricingUsed`: Kullanılan fiyatlandırma bilgileri
- `createdItems`: Oluşturulan kayıtların detayları

---

## Mevcut Durum Analizi

### ✅ Çalışan Endpoint'ler
1. **`POST /MeterReadings/distribute-shared-consumption`**
   - ✅ Endpoint mevcut
   - ✅ Doğru format döndürüyor
   - ✅ Dağıtım hesaplaması çalışıyor

### ❌ Eksik/Sorunlu Endpoint'ler

#### 1. **`GET /MeterReadings/pricing/{year}/{month}/{type}`**
- ❌ **Hata**: `Invalid object name 'UtilityPricingConfigurations'`
- **Çözüm**: `UtilityPricingConfigurations` tablosunu oluştur

```sql
CREATE TABLE UtilityPricingConfigurations (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    MeterType INT NOT NULL, -- 0=Elektrik, 1=Su
    Year INT NOT NULL,
    Month INT NOT NULL,
    UnitPrice DECIMAL(18,2) NOT NULL,
    VatRate DECIMAL(5,2) NOT NULL,
    BtvRate DECIMAL(5,2) NOT NULL,
    EffectiveDate DATETIME2 NOT NULL,
    ExpiryDate DATETIME2 NULL,
    Description NVARCHAR(500) NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NULL
);

-- Varsayılan veriler
INSERT INTO UtilityPricingConfigurations (MeterType, Year, Month, UnitPrice, VatRate, BtvRate, EffectiveDate, Description)
VALUES 
(0, 2025, 1, 2.50, 20.00, 5.00, '2025-01-01', '2025 yılı elektrik fiyatlandırması'),
(1, 2025, 1, 15.00, 20.00, 5.00, '2025-01-01', '2025 yılı su fiyatlandırması');
```

#### 2. **`POST /MeterReadings/apply-shared-consumption`**
- ❓ **Durum**: Test edilmedi
- **Gereksinim**: Implement edilmeli

---

## Test Senaryoları

### 1. Fiyatlandırma Endpoint Testi
```bash
# Elektrik fiyatları
curl -X GET "http://localhost:5000/MeterReadings/pricing/2025/9/0" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Su fiyatları  
curl -X GET "http://localhost:5000/MeterReadings/pricing/2025/9/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Dağıtım Hesaplama Testi
```bash
curl -X POST "http://localhost:5000/MeterReadings/distribute-shared-consumption" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "periodYear": 2025,
    "periodMonth": 9,
    "sharedAreaConsumption": 50.0,
    "mescitConsumption": 50.0
  }'
```

### 3. Uygulama Testi
```bash
curl -X POST "http://localhost:5000/MeterReadings/apply-shared-consumption" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "operationId": "test-001",
    "periodYear": 2025,
    "periodMonth": 9,
    "dueDate": "2025-10-15T00:00:00.000Z",
    "vatRate": 0,
    "btvRate": 0,
    "defaultUnitPrice": 0,
    "items": [
      {
        "flatId": "2ac684f9-12bf-4fb0-83a5-d276e9ffd10c",
        "shareCount": 1,
        "distributedConsumption": 25.0,
        "unitPrice": null
      }
    ]
  }'
```

---

## Öncelik Sırası

### 1. 🔴 Yüksek Öncelik
- **`UtilityPricingConfigurations` tablosunu oluştur**
- **`GET /pricing` endpoint'ini implement et**

### 2. 🟡 Orta Öncelik  
- **`POST /apply-shared-consumption` endpoint'ini implement et**
- **Test senaryolarını çalıştır**

### 3. 🟢 Düşük Öncelik
- **Hata yönetimini geliştir**
- **Logging ekle**
- **Performance optimizasyonu**

---

## Notlar

1. **Frontend Geçici Çözüm**: Şu anda frontend'de varsayılan fiyatlarla hesaplama yapılıyor
2. **Veri Tutarlılığı**: `operationId` ile duplicate işlemleri engelle
3. **Rollback**: Hata durumunda oluşturulan kayıtları geri al
4. **Validation**: Tüm input parametrelerini validate et
5. **Authorization**: Tüm endpoint'lerde token kontrolü yap

Bu dökümantasyon backend geliştiricisi ile paylaşılabilir ve implementasyon rehberi olarak kullanılabilir.
