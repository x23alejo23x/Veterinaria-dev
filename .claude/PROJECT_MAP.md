# 🗺️ Mapa del Proyecto — Nura VetCare
> Generado automáticamente. Actualizar con skill `/project-map`.

## Rutas del proyecto
```
C:\MisProgramas\Proyectos\Personal\Veterinaria-dev\
├── src/
│   ├── App.jsx                          ← Router principal (React Router v7)
│   ├── main.jsx                         ← Entry point, ErrorBoundary, ThemeProvider, Toaster
│   ├── index.css                        ← Tailwind v4 + @heroui/styles + variables CSS dark/light
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell/               ← grid h-svh + Sidebar fixed + main flex-col
│   │   │   ├── Header/                 ← sticky, search, logout, theme toggle
│   │   │   ├── Sidebar/                ← fixed w-14 (cerrado) → w-[232px] (hover/click)
│   │   │   ├── Navbar/                 ← mobile nav
│   │   │   └── PageContainer/          ← flex h-full flex-col, scrollable prop
│   │   │
│   │   ├── ui/
│   │   │   ├── Badge/                  ← tones: blue/green/amber/rose
│   │   │   ├── Button/                 ← variants: primary/default/ghost/danger
│   │   │   ├── Card/                   ← border + surface + shadow, hover prop
│   │   │   ├── EmptyState/             ← estado vacío con icono
│   │   │   ├── FormField/              ← wrapper react-hook-form con error inline
│   │   │   ├── Input/                  ← con icon prop, variables CSS
│   │   │   ├── Modal/                  ← framer-motion, backdrop blur
│   │   │   ├── SearchInput/            ← Input con icono Search
│   │   │   ├── Select/                 ← options=[string|{value,label}], onChange({target:{value}})
│   │   │   ├── StatsCard/              ← icon + value + label + tone + trend
│   │   │   └── Table/                  ← columns[{key,label,width,render,sortable}] + pageSize + loading
│   │   │
│   │   └── feedback/
│   │       ├── ErrorBoundary/          ← class component, captura crashes globales
│   │       ├── Skeleton/               ← TableSkeleton, PageSkeleton
│   │       └── Loading/
│   │
│   ├── pages/
│   │   ├── Admin/View/                 ← SaaS admin: empresas, límites pacientes/usuarios
│   │   ├── Auth/View/                  ← Login con env vars VITE_LOGIN_USER/PASS/ROLE
│   │   ├── Dashboard/View/             ← banner, quick cards, chart CSS, novedades, facturación
│   │   │   └── Components/ActivityChart/ ← gráfico barras CSS puro (sin recharts)
│   │   ├── Medications/View/           ← catálogo + calculadora modal + prescripciones
│   │   ├── Owners/View/                ← CRUD propietarios
│   │   ├── PatientProfile/View/        ← perfil CRM: hero banner + sidebar + tabs
│   │   ├── Patients/View/              ← tabla pacientes, filtro dropdown especie, modal rhf+zod
│   │   └── Shared/ComingSoon/          ← placeholder para vistas pendientes
│   │
│   ├── hooks/
│   │   ├── index.jsx                   ← barrel: useFetch, useMutation, useDebounce, useConfirm
│   │   ├── useFetch.js                 ← GET: {data, loading, error, refetch, reset}
│   │   ├── useMutation.js              ← POST/PUT/DELETE: {mutate, loading, error, data, reset}
│   │   ├── useDebounce.js              ← useDebounce(value, delay=300)
│   │   └── useConfirm.jsx              ← dialog confirmación: const {confirm, ConfirmDialog} = useConfirm()
│   │
│   ├── services/
│   │   ├── api.js                      ← axios instance, BASE_URL=VITE_API_BASE_URL, interceptors JWT
│   │   └── auth.js                     ← sessionService (localStorage 'vet-session') + loginService mock
│   │
│   ├── store/
│   │   └── appStore.js                 ← Zustand: patients, owners, medications, prescriptions + safeAction()
│   │
│   ├── contexts/
│   │   └── ThemeContext.jsx            ← isDark, toggle → clase .dark en <html>
│   │
│   ├── constants/
│   │   └── index.js                    ← navItems, userProfile, seed data, billingData, novedades, companiesSeed
│   │
│   ├── utils/
│   │   ├── notify.js                   ← notify.success/error/warning/info/promise
│   │   ├── schemas.js                  ← Zod: patientSchema, ownerSchema, medicationSchema, loginSchema
│   │   └── doseCalculator.js           ← calculateDose(doseForm) → {doseMg, amountMl, dailyTakes, totalMl}
│   │
│   └── router/
│       └── ProtectedRoute/             ← sessionService.get() + requiredRole prop para RBAC
```

## Variables CSS (dark/light)
```css
--bg, --surface, --surface-2, --border
--text, --text-2, --text-3
--primary, --primary-10
```

## Rutas de la app
```
/login        → AuthView (pública)
/dashboard    → DashboardView
/pacientes    → PatientsView
/pacientes/:id → PatientProfileView
/medicaciones → MedicationsView
/propietarios → OwnersView
/agenda       → ComingSoon
/historial    → ComingSoon
/seguimientos → ComingSoon
/reportes     → ComingSoon
/configuracion → ComingSoon
/admin        → AdminView (requiredRole="admin")
```

## Patrones clave
- **Formularios**: `useForm({resolver: zodResolver(schema)})` + `<FormField error={errors.x}>`
- **Eliminar**: siempre `useConfirm` antes de llamar al store
- **Búsqueda**: `useDebounce(search, 280)` + `useMemo` para filtrar
- **Tablas**: `<Table columns={[]} rows={[]} pageSize={10} />` — ocupa todo el alto disponible
- **Notificaciones**: `notify.success/error/warning` de src/utils/notify.js
- **Store actions**: todas envueltas en `safeAction()` con try/catch automático
- **Auth**: `sessionService.get()` → `{userId, role, token, name}`
