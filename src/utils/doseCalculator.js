export function calculateDose({ weight, concentration, mgKg, frequency, duration }) {
  const numericWeight = Number(weight) || 0
  const numericConcentration = Number(concentration) || 1
  const numericMgKg = Number(mgKg) || 0
  const numericFrequency = Number(frequency) || 1
  const numericDuration = Number(duration) || 1
  const doseMg = numericWeight * numericMgKg
  const amountMl = doseMg / numericConcentration
  const dailyTakes = Math.max(1, Math.round(24 / numericFrequency))
  return {
    doseMg: doseMg.toFixed(1),
    amountMl: amountMl.toFixed(2),
    dailyTakes,
    totalMl: (amountMl * dailyTakes * numericDuration).toFixed(1),
  }
}
