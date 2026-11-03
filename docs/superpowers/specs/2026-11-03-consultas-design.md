# Diseño: Módulo de Consultas — Nura VetCare

**Fecha:** 2026-11-03  
**Estado:** Aprobado — pendiente implementación  
**Rama:** Preproduccion

---

## 1. Objetivo

Implementar un flujo de consulta clínica estructurado con apertura/cierre que permita:
- Gestión completa del paciente durante una consulta (notas, medicamentos, exámenes, hospitalización)
- Reporte de cobro en tiempo real y al cierre
- Historia clínica descargable en PDF
- Acceso desde el calendario y desde el perfil del paciente
- Control por rol: médico gestiona, admin puede editar en cualquier estado

---

## 2. Modelo de datos — Backend (Laravel)

### 2.1 Tabla `consultas`
```sql
id               BIGINT PK
patient_id       FK → patients
appointment_id   FK → appointments (nullable)
vet              VARCHAR
status           ENUM('abierta', 'en_progreso', 'cerrada')
chief_complaint  TEXT           -- motivo de consulta
diagnosis        TEXT           -- diagnóstico
base_fee         DECIMAL(10,2)  -- costo de la consulta inicial
opened_at        TIMESTAMP
closed_at        TIMESTAMP (nullable)
created_at, updated_at
```

### 2.2 Tabla `exam_catalog`
```sql
id          BIGINT PK
name        VARCHAR
category    VARCHAR
base_price  DECIMAL(10,2)
description TEXT (nullable)
created_at, updated_at
```

### 2.3 Tabla `consulta_exams`
```sql
id          BIGINT PK
consulta_id FK → consultas
name        VARCHAR         -- puede venir del catálogo o ser libre
category    VARCHAR (nullable)
unit_price  DECIMAL(10,2)   -- editable, puede diferir del catálogo
notes       TEXT (nullable)
created_at
```

### 2.4 Tabla `consulta_hospitalization`
```sql
id           BIGINT PK
consulta_id  FK → consultas (UNIQUE — 0 o 1 por consulta)
days         INT
price_per_day DECIMAL(10,2)
total        DECIMAL(10,2)  -- calculado: days × price_per_day
notes        TEXT (nullable)
created_at, updated_at
```

### 2.5 Modificaciones a `prescriptions`
```sql
+ consulta_id  FK → consultas (nullable, backward compatible)
+ unit_price   DECIMAL(10,2) (nullable)
```

### 2.6 Modificaciones a `appointments`
```sql
+ consulta_id  FK → consultas (nullable)
```

---

## 3. Endpoints API — Backend

### Consultas
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/consultas` | Listar (filtros: `patient_id`, `status`, `date_from`, `date_to`) |
| GET | `/api/consultas/:id` | Obtener consulta completa (con exámenes, hospitalización, prescripciones) |
| POST | `/api/consultas` | Crear (estado inicial: `abierta`) |
| PUT | `/api/consultas/:id` | Actualizar datos de la consulta |
| PUT | `/api/consultas/:id/close` | Cerrar consulta (status → `cerrada`, registra `closed_at`) |
| PUT | `/api/consultas/:id/reopen` | Reabrir (solo admin, status → `en_progreso`) |
| DELETE | `/api/consultas/:id` | Eliminar (solo si está `abierta`) |

### Exámenes de consulta
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/consultas/:id/exams` | Agregar examen |
| PUT | `/api/consultas/:id/exams/:examId` | Editar examen |
| DELETE | `/api/consultas/:id/exams/:examId` | Eliminar examen |

### Hospitalización
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/consultas/:id/hospitalization` | Crear/actualizar hospitalización |
| DELETE | `/api/consultas/:id/hospitalization` | Eliminar hospitalización |

### Catálogo de exámenes
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/exam-catalog` | Listar catálogo |
| POST | `/api/exam-catalog` | Crear ítem |
| PUT | `/api/exam-catalog/:id` | Editar |
| DELETE | `/api/exam-catalog/:id` | Eliminar |

---

## 4. Ciclo de vida de la consulta

```
POST /api/consultas
  └─ status: "abierta"
       │
       ├─ médico agrega notas, meds, exámenes, hospitalización
       │   └─ status auto → "en_progreso" al primer ítem
       │
       └─ PUT /api/consultas/:id/close
            └─ status: "cerrada" → cobro congelado → PDF disponible
                 │
                 └─ Admin: PUT /api/consultas/:id/reopen
                      └─ status: "en_progreso"
```

---

## 5. Estructura frontend

### 5.1 Nuevas rutas
```
/consultas          → ConsultasView    (lista global)
/consultas/:id      → ConsultaView     (área de trabajo)
```

### 5.2 Carpeta de páginas
```
src/pages/Consultas/
  Components/
    ConsultaHeader/        ← estado, paciente, vet, botón cerrar/reabrir
    NotasPanel/            ← notas clínicas de la consulta
    MedicamentosPanel/     ← prescripciones con costo unitario
    ExamenesPanel/         ← exámenes (catálogo + libre)
    HospitalizacionPanel/  ← días × precio/día
    CobrosPanel/           ← resumen live + botón PDF
    ConsultasList/         ← tabla de consultas (para ConsultasView)
  services/index.js        ← useConsultas, useConsulta, useCreateConsulta, useCloseConsulta
  constants/index.js       ← STATUS_CFG, colores por estado
  View/index.jsx           ← área de trabajo (layout 2 columnas)
  ListView/index.jsx       ← lista global de consultas
```

### 5.3 Layout de ConsultaView
```
┌─────────────────────────────────────────────────────┐
│ HEADER: Paciente · Especie · Dr. X · [● Estado]    │
│ Abierta: 03/11/2026 10:30      [Cerrar consulta →]  │
├──────────────┬──────────────────────────────────────┤
│  CobrosPanel │  Tabs: Notas | Medicamentos |        │
│  (sticky)    │        Exámenes | Hospitalización    │
│              │                                      │
│  Consulta    │  Panel activo                        │
│  Meds        │                                      │
│  Exámenes    │                                      │
│  Hosp.       │                                      │
│  ─────────   │                                      │
│  TOTAL       │                                      │
│  [📄 PDF]    │                                      │
└──────────────┴──────────────────────────────────────┘
```

### 5.4 Modificaciones a páginas existentes

| Página | Cambio |
|--------|--------|
| `PatientProfileView` | Nuevo tab **"Consultas"** — historial de consultas del paciente + botón "Nueva consulta" |
| `AppointmentsView` | Botón **"Iniciar consulta"** en detalle de cita → crea consulta y redirige a `/consultas/:id` |
| `MedicationsView` | Nuevo tab **"Exámenes"** — CRUD del `exam_catalog` |
| `AppointmentsView` | Conectar al backend (reemplazar Zustand por `useAppointments()`) |

---

## 6. PDF — Historia clínica y reporte de cobro

- Generado con `window.print()` + CSS `@media print` (sin dependencia externa)
- Componente `<ConsultaPDF>` renderizado fuera del DOM normal, oculto en pantalla
- Contenido del PDF:
  - Header: logo clínica, nombre paciente, especie, raza, propietario
  - Datos de la consulta: fecha, veterinario, motivo, diagnóstico
  - Sección medicamentos: nombre, dosis, frecuencia, duración, costo
  - Sección exámenes: nombre, categoría, costo
  - Sección hospitalización: días, precio/día, total
  - **Resumen de cobro**: desglose + total general
  - Footer: fecha de emisión, firma

---

## 7. Catálogo de exámenes — UI

Vive como tercer tab en `MedicationsView` (Catálogo | Prescripciones | **Exámenes**):
- Tabla con columnas: Nombre, Categoría, Precio base, Acciones
- Modal de creación/edición
- Al asignar un examen en una consulta: se pre-rellena el precio del catálogo pero es editable
- Opción "Examen libre" para escribir nombre y precio sin usar el catálogo

---

## 8. Orden de implementación sugerido

1. **Backend:** Migraciones + modelos + endpoints de `consultas` y `consulta_exams`
2. **Backend:** Endpoints de `exam_catalog` y `consulta_hospitalization`
3. **Backend:** Modificar `prescriptions` (agregar `consulta_id`, `unit_price`)
4. **Frontend:** `ConsultaView` + `ConsultaHeader` + `CobrosPanel`
5. **Frontend:** `NotasPanel` + `MedicamentosPanel`
6. **Frontend:** `ExamenesPanel` + `HospitalizacionPanel`
7. **Frontend:** `ConsultasView` (lista global)
8. **Frontend:** Modificar `PatientProfileView` (tab Consultas)
9. **Frontend:** Modificar `AppointmentsView` (botón iniciar + backend)
10. **Frontend:** Tab Exámenes en `MedicationsView`
11. **Frontend:** Componente PDF + CSS de impresión

---

## 9. Reglas de negocio

- Solo admin puede reabrir una consulta cerrada
- Al cerrar una consulta los costos quedan congelados (no recalcular)
- Una cita puede tener como máximo una consulta activa
- Las prescripciones creadas dentro de una consulta heredan el `consulta_id`
- El `base_fee` se define al crear la consulta y es editable mientras esté abierta
- El PDF solo está disponible cuando la consulta está `cerrada`

---

## 10. Suposiciones

- No hay módulo de pagos real (el cobro es solo un reporte)
- No se maneja IVA ni impuestos por ahora
- El catálogo de exámenes es gestionado por admin
- Los roles son: `admin` (acceso total) y `medico` (sin reabrir consultas cerradas)
