# Veterinaria Dev — Nura VetCare

Plantilla SaaS de gestión clínica veterinaria. Lista para conectar con backend real.

## Stack
- **React 19** + Vite 8 (JSX, sin TypeScript por ahora)
- **Tailwind CSS v4** + `@tailwindcss/vite`
- **HeroUI v3** (`@heroui/react`) — componentes UI principales
- **Zustand 5** — estado global (`src/store/appStore.js`)
- **react-hook-form** + **Zod** — validación de formularios
- **framer-motion** — animaciones
- **react-hot-toast** — notificaciones (`src/utils/notify.js`)
- **axios** — cliente HTTP (`src/services/api.js`)
- **React Router DOM v7**

## Estructura global
```
src/
├── components/
│   ├── layout/        # AppShell, Sidebar, Header, Navbar, PageContainer
│   ├── ui/            # Button, Card, Input, Select, Table, Modal, Badge, FormField, Combobox
│   ├── charts/        # BarChart, LineChart, DonutChart, HBarChart + theme.js (Recharts)
│   └── feedback/      # ErrorBoundary, Loading, Skeleton
├── pages/             # Una carpeta por vista (ver patrón de páginas abajo)
├── hooks/             # useDebounce, useConfirm, useFetch, useMutation
├── services/          # api.js (axios), auth.js (sessionService)
├── store/             # appStore.js (Zustand)
├── contexts/          # ThemeContext (dark/light mode)
├── utils/             # notify.js, schemas.js (Zod), doseCalculator.js, apiResponse.js
├── constants/         # index.js — seed data y config de nav
└── router/            # ProtectedRoute (con RBAC)
```

## Estructura de páginas — PATRÓN OBLIGATORIO

Cada página sigue esta estructura completa. **NO mezclar lógica y UI en un solo archivo.**

```
src/pages/NombrePagina/
  Components/
    ComponenteA/index.jsx   ← componente real, recibe datos por props
    ComponenteB/index.jsx   ← componente real, recibe datos por props
    index.jsx               ← VACÍO o solo comentarios (no re-exportar)
  constants/
    index.js                ← constantes y utils específicas de esta página
  services/
    index.js                ← hooks de servicio: useEntidad(), useCreateEntidad(), etc.
  View/index.jsx            ← orquestador: accede al store, pasa props, < 80 líneas
  index.jsx                 ← NO USAR — App.jsx importa directo desde View
```

**Reglas generales:**
- `View/index.jsx` es el único que accede a `useAppStore`; pasa los datos como props
- Sub-componentes > 30 líneas → carpeta propia en `Components/`
- Sub-componentes simples (< 30 líneas) → funciones locales al final de `View/index.jsx`
- Barrels (`Components/index.jsx`) no re-exportan — importar directo: `import { X } from '../Components/X'`
- `pages/X/index.jsx` no existe o está vacío — `App.jsx` importa desde `pages/X/View`

**Reglas de `constants/index.js` (carpeta dentro de la página):**
- Aquí van las constantes y helpers **específicos** de esa vista: colores por estado, gradientes, arrays de opciones, formatters
- NO duplicar aquí lo que ya está en `src/constants/` (seed data global) o `src/utils/` (utils globales)
- Importar desde View: `import { X } from '../constants'`
- Importar desde Components/Foo: `import { X } from '../../constants'`
- Node/Vite resuelven `'../constants'` → `'../constants/index.js'` automáticamente

**Reglas de `services/index.js` (capa de datos):**
- Exporta hooks con nombre semántico: `usePatients`, `useCreatePatient`, `useDeletePatient`
- **Hereda** de los hooks globales: `useFetch` y `useMutation` (`src/hooks/useFetch.js`)
- **Usa** los helpers de `src/utils/apiResponse.js` (`unwrap`, `paginated`, `single`, `isEmpty`)
- Mientras no haya backend: dejar las URLs como comentario — el store Zustand sigue siendo la fuente
- Cuando haya backend: descomentar las URLs y el View cambia de `useAppStore` a `usePatients()`

**Referencia:** `src/pages/Patients/` es el ejemplo canónico completo (con `constants.js`, `services/`, `Components/`, `View/`).

## Capa de servicios — flujo de conexión al backend

```
View/index.jsx
  │ accede store (ahora)   │ accede servicio (cuando haya backend)
  │                        │
  └─ useAppStore(…)        └─ usePatients()   ← pages/Patients/services/index.js
                                │
                                └─ useFetch('/patients', { transform: paginated })
                                      │
                                      └─ api.js (axios) + apiResponse.js (unwrap/paginated/single)
```

**`src/utils/apiResponse.js` — helpers globales:**
- `unwrap(res)` → extrae `res.data.items ?? res.data ?? res`
- `paginated(res)` → `{ items, total, page, pageSize }`
- `single(res)` → objeto único de una respuesta POST/GET
- `isEmpty(data)` → true si null / [] / {}
- `isReady({ loading, error, data })` → true cuando la petición terminó bien
- `errorMessage(err)` → mensaje legible del error de axios

## Imports — alias `@`

Todos los imports usan el alias `@` que apunta a `src/`. **Nunca usar rutas relativas con `../../`**.

```js
// ✅ correcto
import { Button }     from '@/components/ui/Button'
import { useAppStore } from '@/store/appStore'
import { notify }     from '@/utils/notify'
import { TABS }       from '@/pages/PatientProfile/constants'

// ❌ incorrecto
import { Button } from '../../../components/ui/Button'
```

Configurado en `vite.config.js` → `resolve.alias { '@': src/ }`.

## Convenciones de componentes
- Componentes en `PascalCase`, archivos como `index.jsx`
- CSS con variables CSS custom: `var(--text)`, `var(--surface)`, `var(--border)`, `var(--text-3)`
- Dark mode vía clase `.dark` en `<html>` (ThemeContext)
- Nunca usar colores hardcoded como `text-slate-900` — usar `text-[var(--text)]`
- Gradientes de colores para avatares: `from-blue-500 to-blue-700`, etc.

## Gráficos — `src/components/charts/` (Recharts)

Todos los gráficos de datos usan los wrappers de `@/components/charts`. **No hacer gráficos con divs/SVG a mano.**

| Componente   | Uso                                            | Props clave                                   |
|--------------|------------------------------------------------|-----------------------------------------------|
| `BarChart`   | series por categoría, agrupadas o `stacked`    | `data, xKey, series=[{key,label}], formatter` |
| `LineChart`  | tendencia; `dashed` para contexto, `area` 1 serie | `data, xKey, series, formatter, tickFormatter` |
| `DonutChart` | parte-del-todo (máx. 5, resto → "Otros")       | `data=[{label,value}], center, legendPosition` |
| `HBarChart`  | ranking top N, un solo tono, `emphasis`        | `data=[{label,value}], max, tone, onBarClick`  |

**Reglas:**
- Paleta y formatters en `charts/theme.js` (`useChartTheme`, `fmtCOP`, `fmtCompact`, `fmtInt`). Paleta categórica validada para light/dark y daltonismo — **no añadir colores nuevos**; máximo 5 series, luego agrupar.
- El color sigue a la entidad en orden fijo (`series[i]` → `categorical[i]`); nunca se cicla ni se reasigna al filtrar.
- Texto (ejes, tooltips, leyendas) siempre con `var(--text*)`, nunca con el color de la serie.
- Un solo eje Y. Dos medidas de escala distinta → dos gráficos.
- Los agregados los calcula el backend (`GROUP BY`) y devuelve series listas. El front no suma registros.
- Cada reporte va dentro de `pages/Reports/Components/ReportCard` (título, loading, vacío, error).
- Ejemplos: `pages/Dashboard/Components/ActivityChart`, `pages/Reports/Components/*`.

## Formularios
- Siempre usar `react-hook-form` + `zodResolver` + esquemas de `src/utils/schemas.js`
- Mostrar errores con `<FormField error={errors.campo}>`
- El botón submit debe tener `disabled={isSubmitting}`

## Estado global (Zustand)
- Todas las acciones CRUD están en `appStore.js` envueltas en `safeAction()` para manejo de errores
- NO llamar a la API directamente en componentes — usar el store (ahora) o el service hook (con backend)
- Cuando el backend esté listo: cada `View` pasa de `useAppStore` al hook del service correspondiente

## Auth y RBAC
- Sesión en `localStorage` con clave `vet-session` via `sessionService` (`src/services/auth.js`)
- `ProtectedRoute` acepta prop `requiredRole` — la ruta `/admin` requiere `role: "admin"`
- Logout: `sessionService.clear()` → redirect a `/login`

## Rutas principales
```
/login         → AuthView (pública)
/dashboard     → DashboardView
/pacientes     → PatientsView + /pacientes/:id PatientProfileView
/medicaciones  → MedicationsView
/propietarios  → OwnersView
/reportes      → ReportsView (7 reportes con filtro de rango 3m/6m/12m)
/admin         → AdminView (requiredRole="admin")
```

## Comandos de desarrollo
```bash
npm run dev      # dev server en puerto 6358
npm run build    # build producción
npm run lint     # ESLint
```

## Variables de entorno (.env.local)
```
VITE_API_BASE_URL=https://tu-api.com/api
VITE_LOGIN_USER=samayaca
VITE_LOGIN_PASS=...
VITE_LOGIN_ROLE=admin
```

## Lo que FALTA conectar al backend
- En cada `pages/X/services/index.js`: descomentar URLs y conectar al `api.js`
- En cada `pages/X/View/index.jsx`: cambiar `useAppStore` por el hook de servicio correspondiente
- Cambiar `loginService` en `auth.js` para usar JWT real
- Activar validación de sesión real en `ProtectedRoute`
- Reemplazar seed data en `appStore.js` (se puede eliminar progresivamente por entidad)
