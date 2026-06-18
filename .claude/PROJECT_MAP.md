# 🗺️ Mapa del Proyecto — Nura VetCare
> Regenerado manualmente. Actualizar con skill `/project-map`.

## Rutas del proyecto
```
src/
├── App.jsx                          ← Router React Router v7, todas las rutas definidas aquí
├── main.jsx                         ← Entry point, ErrorBoundary, ThemeProvider, Toaster
├── index.css                        ← Tailwind v4 + @heroui/styles + variables CSS dark/light
│
├── components/
│   ├── layout/
│   │   ├── AppShell/               ← grid h-svh + Sidebar fixed + main flex-col
│   │   ├── Header/                 ← sticky, search, logout, theme toggle
│   │   ├── Sidebar/                ← fixed w-14 (cerrado) → w-[232px] (hover/click)
│   │   ├── Navbar/                 ← mobile nav
│   │   └── PageContainer/          ← flex h-full flex-col, scrollable prop
│   │
│   ├── ui/
│   │   ├── Badge/                  ← tones: blue/green/amber/rose
│   │   ├── Button/                 ← variants: primary/default/ghost/danger
│   │   ├── Calendar/               ← CalendarUI: mes grid + dots de eventos + slide animation
│   │   ├── Card/                   ← border + surface + shadow, hover prop
│   │   ├── Combobox/               ← búsqueda con filtro, usado por Select(searchable)
│   │   ├── DatePicker/             ← selector de fecha
│   │   ├── Drawer/                 ← panel lateral deslizable
│   │   ├── EmptyState/             ← estado vacío con icono
│   │   ├── FormField/              ← label + error inline, props: label, error, required
│   │   ├── Input/                  ← con icon prop, variables CSS
│   │   ├── Modal/                  ← framer-motion, backdrop blur, props: isOpen/onClose/title/description/icon/size/footer
│   │   ├── SearchInput/            ← Input con icono Search
│   │   ├── Select/                 ← options=[string|{value,label}], onChange({target:{value}}), searchable?, compact?, triggerClass?
│   │   ├── StatsCard/              ← icon + value + label + tone + trend
│   │   └── Table/                  ← columns[{key,label,width,render,sortable}] + pageSize + loading
│   │
│   └── feedback/
│       ├── ErrorBoundary/          ← class component, captura crashes globales
│       ├── Skeleton/               ← TableSkeleton, PageSkeleton
│       └── Loading/
│
├── pages/
│   ├── Admin/
│   │   ├── Components/CreateCompanyModal/  ← modal rhf+zod (companySchema)
│   │   ├── Components/EditLimitsModal/     ← editar límites de plan
│   │   ├── Components/UsageBar/            ← barra de uso pacientes/usuarios
│   │   ├── constants/index.js
│   │   └── View/index.jsx                  ← SaaS admin: empresas, límites
│   │
│   ├── Appointments/                       ← /agenda — COMPLETAMENTE IMPLEMENTADO
│   │   ├── Components/AppCard/             ← tarjeta de cita, props: apt/onEdit/onDelete/onDetail/compact/active
│   │   ├── Components/AppointmentDetail/   ← panel detalle: avatar+tipo+estado+rows+editar/eliminar
│   │   ├── Components/AppointmentModal/    ← modal crear/editar cita rhf+zod (appointmentSchema)
│   │   ├── constants/index.js              ← TYPE_CFG, STATUS_CFG, colores por tipo/estado
│   │   ├── services/index.js               ← useAppointments, useCreateAppointment (listos para API)
│   │   └── View/index.jsx                  ← 3 vistas: Mes/Semana/Lista + dayPanel + detailApt
│   │
│   ├── Auth/
│   │   ├── Components/LoginForm/           ← rhf+zod (loginSchema)
│   │   ├── Components/PlanCard/
│   │   ├── Components/PricingPanel/
│   │   ├── constants/index.js
│   │   └── View/index.jsx                  ← login público, mock vs env vars
│   │
│   ├── Dashboard/
│   │   ├── Components/ActivityChart/       ← gráfico barras CSS puro
│   │   ├── Components/BillingCard/
│   │   ├── Components/DonutChart/
│   │   ├── Components/QuickCard/
│   │   ├── Components/Section/
│   │   └── View/index.jsx
│   │
│   ├── FollowUps/View/index.jsx            ← /seguimientos (placeholder ComingSoon)
│   ├── MedicalHistory/View/index.jsx       ← /historial (placeholder ComingSoon)
│   ├── Reports/View/index.jsx              ← /reportes (placeholder ComingSoon)
│   ├── Settings/View/index.jsx             ← /configuracion (placeholder ComingSoon)
│   │
│   ├── Medications/
│   │   ├── Components/DoseCalculatorModal/ ← calculadora de dosis por peso
│   │   ├── Components/MedicationFormModal/ ← crear/editar medicamento
│   │   ├── constants/index.js
│   │   ├── services/index.js               ← listo para API
│   │   └── View/index.jsx
│   │
│   ├── Owners/
│   │   ├── Components/OwnerModal/          ← rhf+zod (ownerSchema)
│   │   ├── services/index.js
│   │   └── View/index.jsx
│   │
│   ├── PatientProfile/                     ← /pacientes/:id — COMPLETAMENTE IMPLEMENTADO
│   │   ├── Components/InfoChip/            ← chip icon+label+value del sidebar
│   │   ├── Components/NoteModal/           ← modal nueva nota clínica; vet pre-seleccionado con session
│   │   ├── Components/PrescriptionModal/   ← modal crear/editar prescripción; modo edit con prop prescription
│   │   ├── Components/ProfileHero/         ← banner gradiente: nombre/especie/estado/badges + botón Nueva nota
│   │   ├── Components/ProfileSidebar/      ← info clínica + propietario
│   │   ├── constants/index.js              ← TABS, statusCfg, PRESCRIPTION_STATUS_CFG, VETS_SEED, getGrad, speciesEmoji
│   │   ├── services/index.js
│   │   └── View/index.jsx                  ← tabs: Datos/Historial/Medicación/Propietario
│   │                                          Medicación: CRUD completo + cambio estado inline (Select compact)
│   │                                          Historial: timeline unificado clinicalNotes + medicalTimeline seed + rx
│   │
│   ├── Patients/
│   │   ├── Components/PatientModal/        ← rhf+zod (patientSchema), modo create/edit
│   │   ├── Components/SpeciesFilter/       ← filtro dropdown especie
│   │   ├── constants/index.js
│   │   ├── services/index.js
│   │   └── View/index.jsx                  ← tabla con botón 💊 por fila → PrescriptionModal
│   │
│   ├── Register/View/index.jsx             ← /registro (placeholder)
│   └── Shared/ComingSoon/index.jsx         ← placeholder genérico
│
├── hooks/
│   ├── useFetch.js       ← GET: {data, loading, error, refetch, reset}
│   ├── useMutation.js    ← POST/PUT/DELETE: {mutate, loading, error, data, reset}
│   ├── useDebounce.js    ← useDebounce(value, delay=300)
│   └── useConfirm.jsx    ← {confirm(opts), ConfirmDialog} — diálogo antes de eliminar
│
├── services/
│   ├── api.js            ← axios, BASE_URL=VITE_API_BASE_URL, interceptor JWT (Authorization: Bearer)
│   └── auth.js           ← sessionService (localStorage 'vet-session') + loginService mock
│
├── store/
│   └── appStore.js       ← Zustand — colecciones: patients, owners, medicationsCatalog,
│                            prescriptions, appointments, clinicalNotes
│                            Acciones: add/update/delete por entidad + safeAction() wrapper
│
├── contexts/
│   └── ThemeContext.jsx  ← isDark, toggle → clase .dark en <html>
│
├── constants/
│   └── index.js          ← navItems, userProfile, seeds (patients/owners/medications/prescriptions/appointments),
│                            medicalTimeline, visitChart, followUps, companiesSeed, billingData, novedades
│
├── utils/
│   ├── notify.js         ← notify.success/error/warning/info/promise
│   ├── schemas.js        ← Zod: patientSchema, ownerSchema, medicationSchema, loginSchema,
│   │                        appointmentSchema, prescriptionSchema, noteSchema, companySchema
│   ├── doseCalculator.js ← calculateDose(doseForm) → {doseMg, amountMl, dailyTakes, totalMl}
│   └── apiResponse.js    ← unwrap, paginated, single, isEmpty, isReady, errorMessage
│
└── router/
    └── ProtectedRoute/   ← sessionService.get() + requiredRole RBAC
```

## Variables CSS (dark/light)
```css
--bg, --surface, --surface-2, --border
--text, --text-2, --text-3
--primary, --primary-10
--shadow-lg
```

## Rutas de la app
```
/login          → AuthView (pública)
/registro       → RegisterView (pública)
/dashboard      → DashboardView
/pacientes      → PatientsView
/pacientes/:id  → PatientProfileView
/medicaciones   → MedicationsView
/propietarios   → OwnersView
/agenda         → AppointmentsView ← IMPLEMENTADA (3 vistas: Mes/Semana/Lista)
/historial      → MedicalHistoryView (ComingSoon)
/seguimientos   → FollowUpsView (ComingSoon)
/reportes       → ReportsView (ComingSoon)
/configuracion  → SettingsView (ComingSoon)
/admin          → AdminView (requiredRole="admin")
*               → redirect /dashboard
```

## Patrones clave
- **Formularios**: `useForm({resolver: zodResolver(schema)})` + `<FormField error={errors.x}>`
- **Eliminar**: siempre `useConfirm` antes de llamar al store
- **Búsqueda**: `useDebounce(search, 280)` + `useMemo` para filtrar
- **Tablas**: `<Table columns={[]} rows={[]} pageSize={10} />`
- **Notificaciones**: `notify.success/error/warning` de `src/utils/notify.js`
- **Store actions**: todas envueltas en `safeAction()` con try/catch automático
- **Auth**: `sessionService.get()` → `{userId, role, token, name}`
- **Select compact**: prop `compact` + `triggerClass` para selects inline en cards

## Pendiente de conectar al backend
| Módulo | Archivo service | Acción |
|---|---|---|
| Pacientes | `pages/Patients/services/index.js` | Descomentar URLs, cambiar `useAppStore` por `usePatients()` |
| Propietarios | `pages/Owners/services/index.js` | Ídem |
| Medicamentos | `pages/Medications/services/index.js` | Ídem |
| Citas | `pages/Appointments/services/index.js` | Ídem |
| Perfil paciente | `pages/PatientProfile/services/index.js` | Ídem |
| Auth | `services/auth.js` función `loginService` | Descomentar `api.post('/auth/login')` |
| VETS_SEED | `pages/PatientProfile/constants/index.js` | Reemplazar con `GET /users?role=vet` |
| clinicalNotes | `store/appStore.js` | Mover a service hook con `useFetch/useMutation` |
