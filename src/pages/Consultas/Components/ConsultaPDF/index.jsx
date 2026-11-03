const fmtCOP = (val) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val ?? 0)

const PRINT_STYLE = `
  @media print {
    body > *:not(#consulta-pdf-root) { display: none !important; }
    #consulta-pdf-root { display: block !important; position: fixed; inset: 0; background: white; color: black; padding: 32px; font-family: system-ui, sans-serif; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; margin: 8px 0; }
    th, td { border: 1px solid #e2e8f0; padding: 6px 10px; text-align: left; }
    th { background: #f8fafc; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
    .divider { border-top: 1px solid #e2e8f0; margin: 16px 0; }
    .total-row { background: #f8fafc; font-weight: 700; }
  }
`

export function ConsultaPDF({ consulta, patient, owner, prescriptions = [], medications = [], exams = [], hospitalization = null }) {
  if (!consulta) return null

  const totalMeds = prescriptions.reduce((s, rx) => s + Number(rx.unitPrice ?? rx.unit_price ?? 0), 0)
  const totalExams = exams.reduce((s, ex) => s + Number(ex.unitPrice ?? ex.unit_price ?? 0), 0)
  const totalHosp = Number(hospitalization?.total ?? 0)
  const total = Number(consulta.baseFee ?? 0) + totalMeds + totalExams + totalHosp

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLE }} />
      <div id="consulta-pdf-root" className="sr-only">
        {/* Header clínica */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Nura VetCare</h1>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 11 }}>Historia clínica — Consulta #{consulta.id}</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: 11, color: '#64748b' }}>
            <p>Emitido: {new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            {consulta.closedAt && <p>Cerrada: {new Date(consulta.closedAt).toLocaleDateString('es-CO')}</p>}
          </div>
        </div>

        <div className="divider" />

        {/* Datos paciente */}
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px' }}>Datos del paciente</h2>
          <table>
            <tbody>
              <tr><td style={{ width: '25%', fontWeight: 600 }}>Nombre</td><td>{patient?.name ?? '—'}</td><td style={{ width: '25%', fontWeight: 600 }}>Especie</td><td>{patient?.species ?? '—'}</td></tr>
              <tr><td style={{ fontWeight: 600 }}>Raza</td><td>{patient?.breed ?? '—'}</td><td style={{ fontWeight: 600 }}>Propietario</td><td>{owner?.name ?? '—'}</td></tr>
              <tr><td style={{ fontWeight: 600 }}>Veterinario</td><td>{consulta.vet}</td><td style={{ fontWeight: 600 }}>Abierta</td><td>{consulta.openedAt ? new Date(consulta.openedAt).toLocaleString('es-CO') : '—'}</td></tr>
            </tbody>
          </table>
        </div>

        {/* Notas clínicas */}
        {(consulta.chiefComplaint || consulta.diagnosis) && (
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px' }}>Notas clínicas</h2>
            {consulta.chiefComplaint && <p style={{ margin: '0 0 8px' }}><strong>Motivo:</strong> {consulta.chiefComplaint}</p>}
            {consulta.diagnosis && <p style={{ margin: 0 }}><strong>Diagnóstico:</strong> {consulta.diagnosis}</p>}
          </div>
        )}

        {/* Medicamentos */}
        {prescriptions.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px' }}>Medicamentos</h2>
            <table>
              <thead><tr><th>Medicamento</th><th>Dosis</th><th>Frecuencia</th><th>Duración</th><th style={{ textAlign: 'right' }}>Costo</th></tr></thead>
              <tbody>
                {prescriptions.map((rx, i) => {
                  const med = medications.find((m) => m.id === (rx.medicationId ?? rx.medication_id))
                  return (
                    <tr key={i}>
                      <td>{med?.name ?? '—'}</td>
                      <td>{rx.dose}</td>
                      <td>{rx.frequency}</td>
                      <td>{rx.duration}</td>
                      <td style={{ textAlign: 'right' }}>{rx.unitPrice ? fmtCOP(rx.unitPrice ?? rx.unit_price) : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Exámenes */}
        {exams.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px' }}>Exámenes</h2>
            <table>
              <thead><tr><th>Examen</th><th>Categoría</th><th style={{ textAlign: 'right' }}>Costo</th></tr></thead>
              <tbody>
                {exams.map((ex, i) => (
                  <tr key={i}>
                    <td>{ex.name}</td>
                    <td>{ex.category ?? '—'}</td>
                    <td style={{ textAlign: 'right' }}>{fmtCOP(ex.unitPrice ?? ex.unit_price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Hospitalización */}
        {hospitalization && (
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px' }}>Hospitalización</h2>
            <table>
              <thead><tr><th>Días</th><th>Precio/día</th><th style={{ textAlign: 'right' }}>Total</th></tr></thead>
              <tbody>
                <tr>
                  <td>{hospitalization.days}</td>
                  <td>{fmtCOP(hospitalization.price_per_day ?? hospitalization.pricePerDay)}</td>
                  <td style={{ textAlign: 'right' }}>{fmtCOP(hospitalization.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div className="divider" />

        {/* Resumen cobros */}
        <div>
          <h2 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px' }}>Resumen de cobros</h2>
          <table>
            <tbody>
              <tr><td>Consulta base</td><td style={{ textAlign: 'right' }}>{fmtCOP(consulta.baseFee)}</td></tr>
              {totalMeds > 0 && <tr><td>Medicamentos</td><td style={{ textAlign: 'right' }}>{fmtCOP(totalMeds)}</td></tr>}
              {totalExams > 0 && <tr><td>Exámenes</td><td style={{ textAlign: 'right' }}>{fmtCOP(totalExams)}</td></tr>}
              {totalHosp > 0 && <tr><td>Hospitalización</td><td style={{ textAlign: 'right' }}>{fmtCOP(totalHosp)}</td></tr>}
              <tr className="total-row"><td><strong>Total</strong></td><td style={{ textAlign: 'right' }}><strong>{fmtCOP(total)}</strong></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
