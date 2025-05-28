
export function calculateElectricityBill(consumptionKWh) {
  const lowerLimit = 150; // kWh
  const lowRate = 1.73;   // Örnek: ₺1.73 / kWh
  const highRate = 2.60;  // Örnek: ₺2.60 / kWh

  if (consumptionKWh <= 0) return 0;

  if (consumptionKWh <= lowerLimit) {
    return +(consumptionKWh * lowRate).toFixed(2);
  } else {
    const lowPart = lowerLimit * lowRate;
    const highPart = (consumptionKWh - lowerLimit) * highRate;
    return +(lowPart + highPart).toFixed(2);
  }
}
