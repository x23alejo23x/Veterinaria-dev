# Módulo de Consultas — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar el módulo de consultas clínicas de Nura VetCare: apertura/cierre de consulta, gestión de notas/medicamentos/exámenes/hospitalización, cobro en tiempo real y PDF descargable.

**Architecture:** Backend Laravel DDD (nuevos dominios Consulta, ExamCatalog, ConsultaExam, ConsultaHospitalization) + Frontend React con nueva página `/consultas/:id` en layout 2 columnas (CobrosPanel sticky izquierda + tabs derecha). Los módulos existentes de Prescription reciben columnas opcionales `consulta_id` y `unit_price` (backward compatible). El PDF se genera con `window.print()` + `@media print`.

**Tech Stack:** Laravel 11 (DDD), Eloquent, PHP 8.2 | React 19, Vite 8, HeroUI v3, Zustand 5, useFetch/useMutation hooks, react-hook-form + Zod, framer-motion, lucide-react

**Spec:** `docs/superpowers/specs/2026-11-03-consultas-design.md`

## Global Constraints

- PHP namespace root: `App\` — dominio en `App\Domain\`, aplicación en `App\Application\`, infraestructura en `App\Infrastructure\Persistence\Eloquent\`, presentación en `App\Presentation\Http\`
- Todos los nuevos bindings de repositorio van en `App\Infrastructure\Providers\RepositoryServiceProvider`
- Rutas protegidas bajo `Route::middleware('auth:sanctum')` en `routes/api.php`
- Frontend: imports solo con alias `@/` — nunca rutas relativas con `../../`
- Variables CSS `var(--text)`, `var(--surface)`, `var(--border)`, `var(--surface-2)` — nunca colores hardcoded como `text-gray-900`
- `onSuccess` en hooks siempre `() => refetch()`, nunca `onSuccess: refetch`
- IDs del backend son numéricos; en opciones Select usar `String(id)`, en payload de envío usar `Number(id)`
- Fechas al backend en formato ISO `YYYY-MM-DD`: `new Date().toISOString().split('T')[0]`
- Migrations en backend: `php artisan make:migration` con nombres descriptivos; correr con `php artisan migrate`
- Status ENUM de consulta: `'abierta'`, `'en_progreso'`, `'cerrada'`

## Review Focus

- **Reabrir consulta cerrada por rol no-admin:** `PUT /api/consultas/:id/reopen` debe retornar 403 si `role !== 'admin'`; test en Task 2.
- **Consulta cerrada — cobros congelados:** después de `close`, modificar prescripciones/exámenes no debe alterar el total archivado; verificar en Task 6.
- **appointment_id único por consulta activa:** una cita con consulta `abierta`/`en_progreso` no puede generar segunda consulta; validar en `StoreConsultaRequest` en Task 1.
- **PDF solo disponible en estado `cerrada`:** el botón en `CobrosPanel` debe estar deshabilitado si `status !== 'cerrada'`; test en Task 9.
- **Examen libre vs catálogo:** `consulta_exams.name` puede ser texto libre o tomado del catálogo; ambos flujos deben funcionar con el mismo endpoint `POST /api/consultas/:id/exams`; test en Task 4.

---

## Task 1: Backend — Dominio Consulta + Migraciones + CRUD básico

**Files:**
- Create: `Veterinaria-api/database/migrations/XXXX_create_consultas_table.php`
- Create: `Veterinaria-api/app/Domain/Consulta/Entities/Consulta.php`
- Create: `Veterinaria-api/app/Domain/Consulta/DTOs/ConsultaDTO.php`
- Create: `Veterinaria-api/app/Domain/Consulta/Repositories/ConsultaRepositoryInterface.php`
- Create: `Veterinaria-api/app/Application/Consulta/UseCases/ListConsultas.php`
- Create: `Veterinaria-api/app/Application/Consulta/UseCases/GetConsulta.php`
- Create: `Veterinaria-api/app/Application/Consulta/UseCases/CreateConsulta.php`
- Create: `Veterinaria-api/app/Application/Consulta/UseCases/UpdateConsulta.php`
- Create: `Veterinaria-api/app/Application/Consulta/UseCases/CloseConsulta.php`
- Create: `Veterinaria-api/app/Application/Consulta/UseCases/ReopenConsulta.php`
- Create: `Veterinaria-api/app/Application/Consulta/UseCases/DeleteConsulta.php`
- Create: `Veterinaria-api/app/Infrastructure/Persistence/Eloquent/Models/Consulta.php`
- Create: `Veterinaria-api/app/Infrastructure/Persistence/Eloquent/Repositories/EloquentConsultaRepository.php`
- Create: `Veterinaria-api/app/Presentation/Http/Requests/Consulta/StoreConsultaRequest.php`
- Create: `Veterinaria-api/app/Presentation/Http/Requests/Consulta/UpdateConsultaRequest.php`
- Create: `Veterinaria-api/app/Presentation/Http/Resources/ConsultaResource.php`
- Create: `Veterinaria-api/app/Presentation/Http\Controllers/Api/ConsultaController.php`
- Modify: `Veterinaria-api/app/Infrastructure/Providers/RepositoryServiceProvider.php` — bind `ConsultaRepositoryInterface → EloquentConsultaRepository`
- Modify: `Veterinaria-api/routes/api.php` — agregar rutas de consultas

**Interfaces:**
- Produces: `ConsultaRepositoryInterface::findAll(array $filters): array`, `create(ConsultaDTO): Consulta`, `update(int $id, ConsultaDTO): Consulta`, `close(int $id): Consulta`, `reopen(int $id): Consulta`, `delete(int $id): void`
- Produces: `ConsultaResource` con campos: `id`, `patient_id`, `appointment_id`, `vet`, `status`, `chief_complaint`, `diagnosis`, `base_fee`, `opened_at`, `closed_at`

- [ ] **Step 1: Crear migración de consultas**

```bash
cd C:\MisProgramas\Proyectos\Personal\Veterinaria-api
php artisan make:migration create_consultas_table
```

Editar el archivo generado con columnas: `id`, `patient_id` (FK unsigned bigint, cascade delete), `appointment_id` (FK nullable), `vet` (string), `status` (enum `abierta/en_progreso/cerrada`, default `abierta`), `chief_complaint` (text, nullable), `diagnosis` (text, nullable), `base_fee` (decimal 10,2, default 0), `opened_at` (timestamp, default now), `closed_at` (timestamp, nullable), `timestamps`.

- [ ] **Step 2: Correr migración**

```bash
php artisan migrate
```
Expected: tabla `consultas` creada sin error.

- [ ] **Step 3: Crear entidad `Consulta`**

`app/Domain/Consulta/Entities/Consulta.php` — clase `final` con constructor `readonly`: `?int $id`, `int $patientId`, `?int $appointmentId`, `string $vet`, `string $status`, `?string $chiefComplaint`, `?string $diagnosis`, `float $baseFee`, `string $openedAt`, `?string $closedAt`, `DateTimeImmutable $createdAt`. Incluir método `static create(...)` que retorna instancia con `status='abierta'` y `openedAt=date('Y-m-d H:i:s')`.

- [ ] **Step 4: Crear `ConsultaDTO`**

`app/Domain/Consulta/DTOs/ConsultaDTO.php` — clase con `static fromArray(array $data): self` mapeando snake_case del request a camelCase del DTO.

- [ ] **Step 5: Crear `ConsultaRepositoryInterface`**

Define los métodos: `findAll(array $filters = []): array`, `findById(int $id): Consulta`, `create(ConsultaDTO $dto): Consulta`, `update(int $id, ConsultaDTO $dto): Consulta`, `close(int $id): Consulta`, `reopen(int $id): Consulta`, `delete(int $id): void`.

- [ ] **Step 6: Crear modelo Eloquent `Consulta`**

`app/Infrastructure/Persistence/Eloquent/Models/Consulta.php` — `$fillable` con todos los campos snake_case; `$casts`: `patient_id` y `appointment_id` como integer, `base_fee` como float, `opened_at` y `closed_at` como datetime.

- [ ] **Step 7: Crear `EloquentConsultaRepository`**

Implementa `ConsultaRepositoryInterface`. `findAll` acepta filtros opcionales `patient_id`, `status`, `date_from`, `date_to`. `close` setea `status='cerrada'` y `closed_at=now()`. `reopen` setea `status='en_progreso'` y `closed_at=null`.

- [ ] **Step 8: Crear use cases**

7 archivos en `app/Application/Consulta/UseCases/`: `ListConsultas`, `GetConsulta`, `CreateConsulta`, `UpdateConsulta`, `CloseConsulta`, `ReopenConsulta`, `DeleteConsulta`. Cada uno recibe el repositorio por constructor e implementa `execute(...)`. `ReopenConsulta` lanza `\Exception` si el rol del usuario no es `admin` (verificar `auth()->user()->role`).

- [ ] **Step 9: Crear `StoreConsultaRequest`**

Reglas: `patient_id` required integer exists:patients,id; `appointment_id` nullable integer exists:appointments,id; `vet` required string max:255; `chief_complaint` nullable string; `base_fee` nullable numeric min:0. Agregar validación custom: si `appointment_id` dado, verificar que no tenga ya una consulta `abierta` o `en_progreso`.

- [ ] **Step 10: Crear `ConsultaResource`**

Retorna todos los campos de la entidad en snake_case. Incluir `prescriptions_count` y `exams_count` cuando estén disponibles (nullable por ahora).

- [ ] **Step 11: Crear `ConsultaController`**

Métodos: `index` (filtros vía query params), `show`, `store`, `update`, `destroy`, `close` (POST → `CloseConsulta`), `reopen` (POST → `ReopenConsulta`).

- [ ] **Step 12: Registrar binding en `RepositoryServiceProvider`**

Agregar: `$this->app->bind(ConsultaRepositoryInterface::class, EloquentConsultaRepository::class);`

- [ ] **Step 13: Registrar rutas en `api.php`**

```php
Route::apiResource('consultas', ConsultaController::class);
Route::post('consultas/{id}/close',   [ConsultaController::class, 'close']);
Route::post('consultas/{id}/reopen',  [ConsultaController::class, 'reopen']);
```

- [ ] **Step 14: Verificar endpoints con curl**

```bash
curl -s -X POST http://localhost:8080/api/consultas \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"patient_id":1,"vet":"Dr. Test","base_fee":50000}' | jq .
```
Expected: `{"data":{"id":1,"status":"abierta",...}}`

- [ ] **Step 15: Commit**

```bash
git add app/Domain/Consulta app/Application/Consulta app/Infrastructure/Persistence/Eloquent/Models/Consulta.php app/Infrastructure/Persistence/Eloquent/Repositories/EloquentConsultaRepository.php app/Infrastructure/Providers/RepositoryServiceProvider.php app/Presentation/Http/Controllers/Api/ConsultaController.php app/Presentation/Http/Requests/Consulta app/Presentation/Http/Resources/ConsultaResource.php routes/api.php database/migrations
git commit -m "feat: add Consulta domain, CRUD endpoints and lifecycle (close/reopen)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 2: Backend — ExamCatalog + ConsultaExam + ConsultaHospitalization

**Files:**
- Create: `Veterinaria-api/database/migrations/XXXX_create_exam_catalog_table.php`
- Create: `Veterinaria-api/database/migrations/XXXX_create_consulta_exams_table.php`
- Create: `Veterinaria-api/database/migrations/XXXX_create_consulta_hospitalization_table.php`
- Create: `Veterinaria-api/app/Domain/ExamCatalog/Entities/ExamCatalog.php`
- Create: `Veterinaria-api/app/Domain/ExamCatalog/DTOs/ExamCatalogDTO.php`
- Create: `Veterinaria-api/app/Domain/ExamCatalog/Repositories/ExamCatalogRepositoryInterface.php`
- Create: `Veterinaria-api/app/Application/ExamCatalog/UseCases/` (List, Get, Create, Update, Delete)
- Create: `Veterinaria-api/app/Infrastructure/Persistence/Eloquent/Models/ExamCatalog.php`
- Create: `Veterinaria-api/app/Infrastructure/Persistence/Eloquent/Models/ConsultaExam.php`
- Create: `Veterinaria-api/app/Infrastructure/Persistence/Eloquent/Models/ConsultaHospitalization.php`
- Create: `Veterinaria-api/app/Infrastructure/Persistence/Eloquent/Repositories/EloquentExamCatalogRepository.php`
- Create: `Veterinaria-api/app/Presentation/Http/Controllers/Api/ExamCatalogController.php`
- Create: `Veterinaria-api/app/Presentation/Http/Controllers/Api/ConsultaExamController.php`
- Create: `Veterinaria-api/app/Presentation/Http/Controllers/Api/ConsultaHospitalizationController.php`
- Create: `Veterinaria-api/app/Presentation/Http/Resources/ExamCatalogResource.php`
- Create: `Veterinaria-api/app/Presentation/Http/Resources/ConsultaExamResource.php`
- Create: `Veterinaria-api/app/Presentation/Http/Resources/ConsultaHospitalizationResource.php`
- Modify: `Veterinaria-api/app/Infrastructure/Providers/RepositoryServiceProvider.php`
- Modify: `Veterinaria-api/routes/api.php`

**Interfaces:**
- Produces: `GET /api/exam-catalog`, `POST /api/exam-catalog`, `PUT /api/exam-catalog/:id`, `DELETE /api/exam-catalog/:id`
- Produces: `POST /api/consultas/:id/exams`, `PUT /api/consultas/:id/exams/:examId`, `DELETE /api/consultas/:id/exams/:examId`
- Produces: `POST /api/consultas/:id/hospitalization`, `DELETE /api/consultas/:id/hospitalization`

- [ ] **Step 1: Crear 3 migraciones**

`exam_catalog`: `id`, `name` (string), `category` (string), `base_price` (decimal 10,2), `description` (text nullable), `timestamps`.

`consulta_exams`: `id`, `consulta_id` (FK → consultas cascade delete), `name` (string), `category` (string nullable), `unit_price` (decimal 10,2), `notes` (text nullable), `created_at` only (no `updated_at`).

`consulta_hospitalization`: `id`, `consulta_id` (FK → consultas, unique), `days` (integer), `price_per_day` (decimal 10,2), `total` (decimal 10,2), `notes` (text nullable), `timestamps`.

- [ ] **Step 2: Correr migraciones**

```bash
php artisan migrate
```
Expected: 3 tablas creadas.

- [ ] **Step 3: Crear dominio ExamCatalog**

Entidad, DTO, repositorio interface siguiendo el patrón de `Prescription`. Modelo Eloquent con `$fillable = ['name', 'category', 'base_price', 'description']`.

- [ ] **Step 4: Crear 5 use cases para ExamCatalog**

`ListExamCatalog`, `GetExamCatalog`, `CreateExamCatalog`, `UpdateExamCatalog`, `DeleteExamCatalog` en `app/Application/ExamCatalog/UseCases/`.

- [ ] **Step 5: Crear modelos Eloquent para ConsultaExam y ConsultaHospitalization**

`ConsultaExam`: `$fillable = ['consulta_id', 'name', 'category', 'unit_price', 'notes']`. Sin timestamps automáticos — solo `$timestamps = false`, `created_at` gestionado manualmente.

`ConsultaHospitalization`: `$fillable = ['consulta_id', 'days', 'price_per_day', 'total', 'notes']`. `$casts`: `days` integer, `price_per_day` y `total` float.

- [ ] **Step 6: Crear 3 controllers**

`ExamCatalogController`: CRUD estándar (apiResource).

`ConsultaExamController`: métodos `store(Request $req, int $consultaId)`, `update(Request $req, int $consultaId, int $examId)`, `destroy(int $consultaId, int $examId)`. Validaciones: `name` required string, `unit_price` required numeric, `category` nullable, `notes` nullable.

`ConsultaHospitalizationController`: métodos `store(Request $req, int $consultaId)` (upsert — crear o actualizar), `destroy(int $consultaId)`. `total` se calcula como `days × price_per_day` en el controller antes de persistir.

- [ ] **Step 7: Registrar bindings y rutas**

En `RepositoryServiceProvider`: bind `ExamCatalogRepositoryInterface → EloquentExamCatalogRepository`.

En `api.php`:
```php
Route::apiResource('exam-catalog', ExamCatalogController::class);
Route::post('consultas/{consulta}/exams',              [ConsultaExamController::class, 'store']);
Route::put('consultas/{consulta}/exams/{exam}',        [ConsultaExamController::class, 'update']);
Route::delete('consultas/{consulta}/exams/{exam}',     [ConsultaExamController::class, 'destroy']);
Route::post('consultas/{consulta}/hospitalization',    [ConsultaHospitalizationController::class, 'store']);
Route::delete('consultas/{consulta}/hospitalization',  [ConsultaHospitalizationController::class, 'destroy']);
```

- [ ] **Step 8: Verificar endpoint de examen libre**

```bash
curl -s -X POST http://localhost:8080/api/consultas/1/exams \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Hemograma completo","unit_price":45000}' | jq .
```
Expected: `{"data":{"id":1,"name":"Hemograma completo","unit_price":45000,...}}`

- [ ] **Step 9: Commit**

```bash
git commit -m "feat: add ExamCatalog, ConsultaExam and ConsultaHospitalization domains

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 3: Backend — Modificar Prescription (consulta_id + unit_price)

**Files:**
- Create: `Veterinaria-api/database/migrations/XXXX_add_consulta_fields_to_prescriptions_table.php`
- Modify: `Veterinaria-api/app/Infrastructure/Persistence/Eloquent/Models/Prescription.php` — agregar `consulta_id` y `unit_price` a `$fillable` y `$casts`
- Modify: `Veterinaria-api/app/Domain/Prescription/Entities/Prescription.php` — agregar propiedades opcionales `?int $consultaId` y `?float $unitPrice`
- Modify: `Veterinaria-api/app/Domain/Prescription/DTOs/PrescriptionDTO.php` — agregar campos opcionales
- Modify: `Veterinaria-api/app/Presentation/Http/Requests/Prescription/StorePrescriptionRequest.php` — agregar `consulta_id` nullable
- Modify: `Veterinaria-api/app/Presentation/Http/Resources/PrescriptionResource.php` — exponer `consulta_id` y `unit_price`

**Interfaces:**
- Consumes: `Consulta::id` de Task 1
- Produces: `PrescriptionResource` incluye `consulta_id` (nullable int) y `unit_price` (nullable float)

- [ ] **Step 1: Crear migración additive**

```bash
php artisan make:migration add_consulta_fields_to_prescriptions_table
```

Agregar: `$table->unsignedBigInteger('consulta_id')->nullable()->after('patient_id')` con FK a `consultas` nullable y `nullOnDelete()`. `$table->decimal('unit_price', 10, 2)->nullable()->after('duration')`.

- [ ] **Step 2: Correr migración**

```bash
php artisan migrate
```

- [ ] **Step 3: Actualizar modelo, entidad, DTO y resource**

Cambios mínimos: agregar los dos campos opcionales en cada archivo. Los campos existentes no cambian.

- [ ] **Step 4: Verificar backward compatibility**

```bash
curl -s http://localhost:8080/api/prescriptions/1 \
  -H "Authorization: Bearer TOKEN" | jq '.data.consulta_id'
```
Expected: `null` (registros existentes no se ven afectados).

- [ ] **Step 5: Commit**

```bash
git commit -m "feat: add consulta_id and unit_price to prescriptions (backward compatible)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 4: Frontend — services y constants de Consultas

**Files:**
- Create: `src/pages/Consultas/services/index.js`
- Create: `src/pages/Consultas/constants/index.js`

**Interfaces:**
- Consumes: `useFetch`, `useMutation` de `@/hooks/useFetch`; `paginated`, `single` de `@/utils/apiResponse`
- Produces: `useConsultas(params, options)`, `useConsulta(id)`, `useCreateConsulta(options)`, `useUpdateConsulta(id, options)`, `useCloseConsulta(options)`, `useReopenConsulta(options)`, `useDeleteConsulta(options)`, `useConsultaExams(consultaId)`, `useAddExam(consultaId, options)`, `useUpdateExam(consultaId, options)`, `useDeleteExam(consultaId, options)`, `useHospitalization(consultaId)`, `useUpsertHospitalization(consultaId, options)`, `useDeleteHospitalization(consultaId, options)`
- Produces: `STATUS_CFG`, `CONSULTA_TABS`, `toConsultaPayload(data)`, `toExamPayload(data)`, `toHospitalizationPayload(data)`

- [ ] **Step 1: Crear `constants/index.js`**

```js
export const STATUS_CFG = {
  abierta:     { label: 'Abierta',     color: 'text-emerald-600', dot: 'bg-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  en_progreso: { label: 'En progreso', color: 'text-amber-600',   dot: 'bg-amber-400',   bg: 'bg-amber-50 dark:bg-amber-500/10' },
  cerrada:     { label: 'Cerrada',     color: 'text-slate-500',   dot: 'bg-slate-400',   bg: 'bg-slate-50 dark:bg-slate-500/10' },
}

export const CONSULTA_TABS = ['Notas', 'Medicamentos', 'Exámenes', 'Hospitalización']
```

- [ ] **Step 2: Crear `services/index.js`**

Exportar todos los hooks listados en Interfaces. Siguiendo exactamente el patrón de `src/pages/Patients/services/index.js`: `useFetch` para lecturas, `useMutation` para escrituras, `toXxxPayload` para transformar camelCase → snake_case.

Funciones de transformación:
- `toConsultaPayload(data)` → `{ patient_id: Number, appointment_id: Number|null, vet: String, chief_complaint: String|null, diagnosis: String|null, base_fee: Number }`
- `toExamPayload(data)` → `{ name: String, category: String|null, unit_price: Number, notes: String|null }`
- `toHospitalizationPayload(data)` → `{ days: Number, price_per_day: Number, notes: String|null }`

Normalización de respuesta (`normalizeConsulta`): mapear `patient_id → patientId`, `appointment_id → appointmentId`, `base_fee → baseFee`, `chief_complaint → chiefComplaint`, `opened_at → openedAt`, `closed_at → closedAt`.

- [ ] **Step 3: Verificar que los hooks no lanzan en módulo sin render**

Importar en `browser console` (o test manual) confirmando que `useConsultas` existe como función exportada.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Consultas/
git commit -m "feat: add Consultas services and constants

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 5: Frontend — ConsultaView esqueleto + ConsultaHeader + CobrosPanel

**Files:**
- Create: `src/pages/Consultas/Components/ConsultaHeader/index.jsx`
- Create: `src/pages/Consultas/Components/CobrosPanel/index.jsx`
- Create: `src/pages/Consultas/View/index.jsx`
- Modify: `src/router/` o `src/App.jsx` — agregar rutas `/consultas` y `/consultas/:id`

**Interfaces:**
- Consumes: `useConsulta(id)` de Task 4; `usePatient(id)` de `@/pages/Patients/services`; `STATUS_CFG` de Task 4
- Produces: `ConsultaView` — layout 2 columnas; `ConsultaHeader` — props: `consulta`, `patient`, `onClose`, `onReopen`; `CobrosPanel` — props: `consulta`, `prescriptions`, `exams`, `hospitalization`, `onPrint`

- [ ] **Step 1: Crear `ConsultaHeader`**

Props: `{ consulta, patient, onClose, onReopen, userRole }`. Muestra: nombre paciente, especie, nombre vet, badge de estado con `STATUS_CFG[consulta.status]`. Botón "Cerrar consulta" si `status !== 'cerrada'`; botón "Reabrir" si `status === 'cerrada' && userRole === 'admin'`. Ambos botones invocan sus callbacks correspondientes.

- [ ] **Step 2: Crear `CobrosPanel`**

Props: `{ consulta, prescriptions, exams, hospitalization, onPrint }`. Calcula en render (no en backend):
```
totalMeds = sum(prescription.unitPrice ?? 0)
totalExams = sum(exam.unitPrice)
totalHosp = hospitalization?.total ?? 0
total = (consulta.baseFee ?? 0) + totalMeds + totalExams + totalHosp
```
Muestra filas de desglose. Botón "Descargar PDF" — `disabled={consulta.status !== 'cerrada'}` — llama `onPrint`. Formato de pesos: `new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value)`.

- [ ] **Step 3: Crear `View/index.jsx`**

Orquestador. Accede a: `useConsulta(id)`, `usePatient`, `usePrescriptions({ consulta_id: id })`, exámenes y hospitalización. Maneja `handleClose` y `handleReopen` usando los hooks de Task 4 con `onSuccess: () => refetchConsulta()`. Layout: `flex gap-0` con `CobrosPanel` a la izquierda (w-72 sticky) y tabs a la derecha. Tabs renderizados como `useState` — solo el panel activo visible.

- [ ] **Step 4: Registrar rutas**

En `src/App.jsx` (o el router): agregar dentro de `<ProtectedRoute>`:
```jsx
<Route path="/consultas"     element={<ConsultaListView />} />
<Route path="/consultas/:id" element={<ConsultaView />} />
```
Donde `ConsultaView` importa desde `@/pages/Consultas/View` y `ConsultaListView` desde `@/pages/Consultas/ListView`.

- [ ] **Step 5: Verificar carga básica en browser**

Navegar a `http://localhost:6358/consultas/1` (si existe). Debe mostrar el header con el nombre del paciente y el panel de cobros con `$0` de total.

- [ ] **Step 6: Commit**

```bash
git commit -m "feat: ConsultaView skeleton with header and billing panel

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 6: Frontend — NotasPanel + MedicamentosPanel

**Files:**
- Create: `src/pages/Consultas/Components/NotasPanel/index.jsx`
- Create: `src/pages/Consultas/Components/MedicamentosPanel/index.jsx`

**Interfaces:**
- Consumes: `useUpdateConsulta(id, options)` de Task 4; `usePrescriptions`, `useCreatePrescription`, `useDeletePrescription`, `toPrescriptionPayload` de `@/pages/Medications/services`; `useMedications` de `@/pages/Medications/services`; `PrescriptionModal` de `@/pages/PatientProfile/Components/PrescriptionModal`
- Produces: `NotasPanel` — props: `{ consulta, onSave }`; `MedicamentosPanel` — props: `{ consulta, prescriptions, medications, refetch }`

- [ ] **Step 1: Crear `NotasPanel`**

Props: `{ consulta, onSave }`. Dos textarea controlados: `chiefComplaint` (motivo de consulta) y `diagnosis` (diagnóstico). Botón "Guardar notas" que llama `onSave({ chiefComplaint, diagnosis })`. Estado deshabilitado si `consulta.status === 'cerrada'`. Hint visual "Consulta cerrada — solo lectura" en ese caso.

- [ ] **Step 2: Crear `MedicamentosPanel`**

Props: `{ consulta, prescriptions, medications, refetch }`. Reutiliza `PrescriptionModal` existente. La prescripción creada aquí debe incluir `consulta_id: consulta.id` en el payload — pasar como prop extra al modal o al hook de creación. Muestra lista de prescripciones de esta consulta (las filtradas por `consulta_id`). Acciones: agregar, editar (via `_updateRx`), eliminar. Deshabilitado si `consulta.status === 'cerrada'`.

- [ ] **Step 3: Conectar en `View/index.jsx`**

Pasar `onSave` a `NotasPanel` que internamente llame `useUpdateConsulta`. Pasar `prescriptions` y `refetch` a `MedicamentosPanel`.

- [ ] **Step 4: Verificar que guardar notas actualiza la consulta**

Escribir en el textarea de diagnóstico → click "Guardar notas" → verificar que el API recibe `PUT /api/consultas/1` con `diagnosis`.

- [ ] **Step 5: Commit**

```bash
git commit -m "feat: NotasPanel and MedicamentosPanel for ConsultaView

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 7: Frontend — ExamenesPanel + HospitalizacionPanel

**Files:**
- Create: `src/pages/Consultas/Components/ExamenesPanel/index.jsx`
- Create: `src/pages/Consultas/Components/HospitalizacionPanel/index.jsx`

**Interfaces:**
- Consumes: `useConsultaExams`, `useAddExam`, `useUpdateExam`, `useDeleteExam`, `useHospitalization`, `useUpsertHospitalization`, `useDeleteHospitalization` de Task 4; `useExamCatalog` (nuevo hook en services, GET `/exam-catalog`)
- Produces: `ExamenesPanel` — props: `{ consulta, refetch }`; `HospitalizacionPanel` — props: `{ consulta, hospitalization, refetch }`

- [ ] **Step 1: Agregar `useExamCatalog` en `services/index.js`**

```js
export function useExamCatalog() {
  return useFetch('/exam-catalog', { transform: paginated, fallback: { items: [] } })
}
```

- [ ] **Step 2: Crear `ExamenesPanel`**

Lista los exámenes de la consulta (`useConsultaExams(consulta.id)`). Botón "Agregar examen" abre un mini-formulario (no modal): seleccionar del catálogo O escribir nombre libre, editar precio. Al confirmar: `useAddExam(consulta.id, { onSuccess: () => refetch() }).add(payload)`. Permite editar precio de cada examen (input inline). Botón eliminar con confirmación. Deshabilitado si `consulta.status === 'cerrada'`.

- [ ] **Step 3: Crear `HospitalizacionPanel`**

Formulario: `days` (number input, min 1) y `price_per_day` (number input). Muestra `total = days × price_per_day` en tiempo real. Botón "Guardar hospitalización" llama `useUpsertHospitalization`. Si existe hospitalización, la carga como valores iniciales. Botón "Eliminar hospitalización" con confirmación. Deshabilitado si `consulta.status === 'cerrada'`.

- [ ] **Step 4: Verificar que CobrosPanel se actualiza en tiempo real**

Agregar un examen → el total en `CobrosPanel` debe reflejar el nuevo valor sin recargar página.

- [ ] **Step 5: Commit**

```bash
git commit -m "feat: ExamenesPanel and HospitalizacionPanel for ConsultaView

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 8: Frontend — ConsultasListView (lista global)

**Files:**
- Create: `src/pages/Consultas/ListView/index.jsx`
- Create: `src/pages/Consultas/Components/ConsultasList/index.jsx`

**Interfaces:**
- Consumes: `useConsultas(params)` de Task 4; `usePatients` de `@/pages/Patients/services`; `useNavigate` de `react-router-dom`
- Produces: `ConsultasListView` — página en `/consultas`; `ConsultasList` — tabla con columnas: Paciente, Veterinario, Estado, Fecha apertura, Acciones

- [ ] **Step 1: Crear `ConsultasList`**

Props: `{ consultas, onOpen }`. Tabla con columnas. Badge de estado usando `STATUS_CFG`. Botón "Abrir" en cada fila llama `onOpen(consulta.id)`. Fila clickeable también navega.

- [ ] **Step 2: Crear `ListView/index.jsx`**

Accede a `useConsultas()`, filtros por `status` y `patient_id`. Botón "Nueva consulta" abre modal simple: seleccionar paciente (Combobox), vet, base_fee. Al crear, redirige a `/consultas/:newId`. Usa `useCreateConsulta({ onSuccess: (res) => navigate(\`/consultas/${res.data.id}\`) })`.

- [ ] **Step 3: Verificar navegación**

Abrir lista en `/consultas` → click en una consulta → navegar a `/consultas/1`.

- [ ] **Step 4: Commit**

```bash
git commit -m "feat: ConsultasListView global list with create and navigation

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 9: Frontend — ConsultaPDF + @media print

**Files:**
- Create: `src/pages/Consultas/Components/ConsultaPDF/index.jsx`

**Interfaces:**
- Consumes: todos los datos de la consulta ya cargados en `View/index.jsx`
- Produces: `ConsultaPDF` — props: `{ consulta, patient, owner, prescriptions, medications, exams, hospitalization }`, se renderiza oculto en pantalla, visible solo en `@media print`

- [ ] **Step 1: Crear `ConsultaPDF`**

Estructura HTML semántica `<article>` con:
- Header: nombre clínica "Nura VetCare", nombre paciente, especie, raza, propietario
- Datos consulta: fecha, vet, motivo, diagnóstico
- Tabla medicamentos: nombre, dosis, frecuencia, duración, costo unitario
- Tabla exámenes: nombre, categoría, costo
- Hospitalización: días, precio/día, total
- Resumen: desglose por sección + total general
- Footer: fecha emisión `new Date().toLocaleDateString('es-CO')`

CSS: clases Tailwind normales + clase `print-only` con `hidden` en pantalla; en `@media print` (`@media print { .print-only { display: block !important } }`). Usar `<style>` inline con `dangerouslySetInnerHTML` para el bloque `@media print`.

- [ ] **Step 2: Integrar en `View/index.jsx`**

Renderizar `<ConsultaPDF ... />` junto al contenido principal. La función `onPrint` en `CobrosPanel` llama `window.print()`. El componente PDF se renderiza fuera del DOM visible — clase `sr-only` en pantalla, bloque completo en print.

- [ ] **Step 3: Verificar PDF**

Abrir consulta cerrada en browser → click "Descargar PDF" → confirmar que aparece el diálogo de impresión del navegador con el contenido correcto.

- [ ] **Step 4: Commit**

```bash
git commit -m "feat: ConsultaPDF component with window.print and @media print styles

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 10: Frontend — Tab "Consultas" en PatientProfileView

**Files:**
- Modify: `src/pages/PatientProfile/constants/index.js` — agregar `'Consultas'` al array `TABS`
- Modify: `src/pages/PatientProfile/View/index.jsx` — agregar panel `ConsultasTab` y botón "Nueva consulta"
- Create: `src/pages/PatientProfile/Components/ConsultasTab/index.jsx`

**Interfaces:**
- Consumes: `useConsultas({ patient_id: id })` de Task 4; `useCreateConsulta` de Task 4; `useNavigate` de `react-router-dom`
- Produces: `ConsultasTab` — props: `{ patientId, consultas, onCreate }`

- [ ] **Step 1: Agregar `'Consultas'` a `TABS` en `constants/index.js`**

El array actual es `['Datos', 'Historial', 'Medicación', 'Propietario']`. Agregar `'Consultas'` al final.

- [ ] **Step 2: Crear `ConsultasTab`**

Props: `{ patientId, consultas, onCreate }`. Lista las consultas del paciente ordenadas por `opened_at` desc. Cada ítem muestra: fecha, vet, estado (badge), motivo, botón "Abrir" que navega a `/consultas/:id`. Botón "Nueva consulta" llama `onCreate`.

- [ ] **Step 3: Modificar `View/index.jsx`**

Agregar:
```jsx
const { data: consultasData, refetch: refetchConsultas } = useConsultas({ patient_id: id }, { immediate: !!id })
const consultas = consultasData?.items ?? []
const { create: createConsulta } = useCreateConsulta({ onSuccess: (res) => navigate(`/consultas/${res.data.id}`) })
```

Agregar en el bloque de tabs:
```jsx
{tab === 'Consultas' && (
  <ConsultasTab
    patientId={id}
    consultas={consultas}
    onCreate={() => createConsulta({ patient_id: id, vet: 'Dr. ...', base_fee: 0 })}
  />
)}
```

Para "Nueva consulta" desde el perfil, abrir un modal simple (similar al de `ListView`) antes de crear.

- [ ] **Step 4: Verificar navegación**

Perfil de paciente → tab "Consultas" → click "Nueva consulta" → redirige a `/consultas/:newId`.

- [ ] **Step 5: Commit**

```bash
git commit -m "feat: add Consultas tab to PatientProfileView

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 11: Frontend — Tab "Exámenes" en MedicationsView

**Files:**
- Modify: `src/pages/Medications/View/index.jsx` — agregar tab "Exámenes"
- Create: `src/pages/Medications/Components/ExamCatalogTab/index.jsx`

**Interfaces:**
- Consumes: `useExamCatalog`, `useCreateExamCatalog`, `useUpdateExamCatalog`, `useDeleteExamCatalog` (nuevos hooks a agregar en `src/pages/Medications/services/index.js` apuntando a `/exam-catalog`)
- Produces: `ExamCatalogTab` — tabla con columnas Nombre, Categoría, Precio base, Acciones

- [ ] **Step 1: Agregar hooks de ExamCatalog en `src/pages/Medications/services/index.js`**

```js
export function useExamCatalog(options = {}) {
  return useFetch('/exam-catalog', { transform: paginated, fallback: { items: [] }, ...options })
}
export function useCreateExamCatalog(options = {}) { /* useMutation POST /exam-catalog */ }
export function useUpdateExamCatalog(id, options = {}) { /* useMutation PUT /exam-catalog/:id */ }
export function useDeleteExamCatalog(options = {}) { /* useMutation DELETE */ }
```

- [ ] **Step 2: Crear `ExamCatalogTab`**

Props: `{ items, onCreate, onEdit, onDelete }`. Tabla con columnas: Nombre, Categoría, Precio base (formateado COP), Acciones (editar/eliminar). Botón "Nuevo examen" en header. Modal de creación/edición compartido con campos: `name` (required), `category` (optional), `base_price` (required number), `description` (optional).

- [ ] **Step 3: Modificar `View/index.jsx` de Medications**

El componente ya tiene tabs. Agregar `'Exámenes'` como tercer tab y renderizar `ExamCatalogTab` cuando esté activo.

- [ ] **Step 4: Verificar CRUD de catálogo**

Crear examen "Radiografía" categoría "Diagnóstico" precio 80000 → aparece en tabla → editar precio → eliminar.

- [ ] **Step 5: Commit**

```bash
git commit -m "feat: ExamCatalog tab in MedicationsView

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 12: Actualizar Obsidian vault + commit final de rama

**Files:**
- Modify: `C:\MisProgramas\My\Nura VetCare\Pendientes\Pendientes generales.md` — mover ítems completados a sección ✅
- Create: `C:\MisProgramas\My\Nura VetCare\Funcionalidades\Módulo Consultas.md` — documentar el módulo implementado

- [ ] **Step 1: Actualizar Pendientes generales.md**

Mover los 4 ítems de alta prioridad (consultas) a sección ✅ Completado.

- [ ] **Step 2: Crear nota en Obsidian**

Documentar: rutas del módulo, estructura de carpetas, ciclo de vida, endpoints principales.

- [ ] **Step 3: Commit final de la feature**

```bash
git add .
git commit -m "feat: complete Consultas module - clinical consultation lifecycle with billing and PDF

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```
