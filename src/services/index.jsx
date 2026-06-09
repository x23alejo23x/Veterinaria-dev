/**
 * Punto de entrada de servicios.
 * Importar desde aquí para centralizar dependencias.
 *
 * HOW TO ADD NEW SERVICE:
 *   1. Crea src/services/myEntityService.js
 *   2. Exporta las funciones aquí
 *   3. Importa en el store o componente
 */

export { default as api }           from './api'
export { sessionService, loginService } from './auth'

// ── Servicios pendientes de implementar ──────────────────
// Estos son los contratos que se conectarán con el backend real.
// Por ahora la data vive en Zustand con seed data.

// export * from './patientService'
// export * from './medicationService'
// export * from './ownerService'
// export * from './prescriptionService'
