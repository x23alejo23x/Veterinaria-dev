import PDFDocument from '/tmp/node_modules/pdfkit/js/pdfkit.js'
import { createWriteStream } from 'fs'
import { homedir } from 'os'
import { join } from 'path'

const output = join(homedir(), 'Desktop', 'Glosario-NuraVetCare.pdf')
const doc = new PDFDocument({ size: 'A4', margin: 50 })
doc.pipe(createWriteStream(output))

const W = doc.page.width - 100
const COLORS = {
  blue:   '#2563eb', blueLight:   '#eff6ff',
  green:  '#16a34a', greenLight:  '#f0fdf4',
  violet: '#7c3aed', violetLight: '#f5f3ff',
  orange: '#ea580c', orangeLight: '#fff7ed',
  rose:   '#e11d48', roseLight:   '#fff1f2',
  gray:   '#64748b', grayBg:      '#f8fafc',
  dark:   '#0f172a',
}

// ── Helpers ──────────────────────────────────────────────
function sectionHeader(title, color, bgColor) {
  doc.moveDown(0.6)
  doc.rect(50, doc.y, W, 28).fill(bgColor)
  doc.fillColor(color).fontSize(11).font('Helvetica-Bold')
     .text(title, 58, doc.y - 22, { continued: false })
  doc.moveDown(0.15)
  doc.fillColor(COLORS.dark)
}

function command(cmd, desc) {
  const y = doc.y
  doc.rect(50, y, W, 22).fill('#f8fafc')
  doc.rect(50, y, 3, 22).fill(COLORS.blue)
  doc.fillColor(COLORS.blue).fontSize(9).font('Helvetica-Bold')
     .text(cmd, 60, y + 5, { width: 200, continued: false })
  doc.fillColor(COLORS.gray).fontSize(9).font('Helvetica')
     .text(desc, 270, y + 5, { width: W - 220 })
  doc.moveDown(0.18)
}

function tip(num, text) {
  doc.rect(50, doc.y, W, 20).fill(COLORS.grayBg)
  doc.fillColor(COLORS.blue).fontSize(9).font('Helvetica-Bold')
     .text(`${num}.`, 58, doc.y - 14, { continued: true })
  doc.fillColor(COLORS.dark).font('Helvetica').text(`  ${text}`, { width: W - 30 })
  doc.moveDown(0.15)
}

// ── Portada / Header ─────────────────────────────────────
doc.rect(0, 0, doc.page.width, 90).fill(COLORS.blue)
doc.fillColor('white').fontSize(22).font('Helvetica-Bold')
   .text('📖 Glosario de Comandos', 50, 22)
doc.fontSize(13).font('Helvetica')
   .text('Nura VetCare — Claude Skills Reference', 50, 52)
doc.fillColor(COLORS.dark)
doc.moveDown(1.5)

// ── Sección 1 ────────────────────────────────────────────
sectionHeader('🗺️  Contexto y Planificación', COLORS.blue, COLORS.blueLight)
command('usa project-map', 'Siempre primero en cada sesión — carga el contexto completo del proyecto')
command('usa prompt-builder [idea]', 'Convierte tu idea en un prompt preciso antes de ejecutar')

// ── Sección 2 ────────────────────────────────────────────
sectionHeader('🏗️  Crear Cosas Nuevas', COLORS.green, COLORS.greenLight)
command('usa vet-view [prompt]', 'Vista completa: tabla + filtros + modal CRUD')
command('usa react-component [prompt]', 'Componente UI reutilizable con HeroUI + dark mode')
command('usa react-form [prompt]', 'Formulario con react-hook-form + validación Zod')
command('usa react-hook [prompt]', 'Custom hook con loading / error / data')

// ── Sección 3 ────────────────────────────────────────────
sectionHeader('🎨  Diseño UI', COLORS.violet, COLORS.violetLight)
command('usa ui-design [prompt]', 'Sección UI completa — responsive, dark mode, animaciones')
command('usa ui-card [prompt]', 'Cards de stats, perfil o info con hover y gradientes')
command('usa ui-layout [prompt]', 'Layouts: sidebar, dashboard, split panels, grids')

// ── Sección 4 ────────────────────────────────────────────
sectionHeader('🔧  Calidad de Código', COLORS.orange, COLORS.orangeLight)
command('usa react-refactor [descripción]', 'Componente largo, código duplicado, hooks mal extraídos')
command('usa react-optimize [descripción]', 'App lenta, re-renders excesivos, listas grandes')
command('usa code-review', 'Revisar diff actual en busca de bugs y mejoras')
command('usa simplify', 'Limpiar y simplificar el código tocado')
command('usa security-review', 'Revisar cambios en busca de vulnerabilidades')

// ── Sección 5 ────────────────────────────────────────────
sectionHeader('✅  Verificación', COLORS.rose, COLORS.roseLight)
command('usa verify', 'Confirmar que un cambio funciona corriendo la app')
command('usa review', 'Revisar un PR completo')
command('usa run', 'Lanzar la app y ver el resultado visualmente')

// ── Flujo recomendado ────────────────────────────────────
doc.moveDown(0.8)
doc.rect(50, doc.y, W, 14).fill(COLORS.blue)
doc.fillColor('white').fontSize(10).font('Helvetica-Bold')
   .text('⚡  Flujo Recomendado por Sesión', 58, doc.y - 10)
doc.fillColor(COLORS.dark).moveDown(0.2)

tip(1, '"usa project-map"  →  Claude carga todo el contexto')
tip(2, '"usa prompt-builder quiero X"  →  Claude genera el prompt óptimo')
tip(3, '"usa vet-view / react-component [prompt]"  →  Claude ejecuta con contexto perfecto')
tip(4, '"usa verify" o "usa code-review"  →  Confirmar que todo funciona')

// ── Tips finales ─────────────────────────────────────────
doc.moveDown(0.6)
doc.rect(50, doc.y, W, 14).fill(COLORS.grayBg)
doc.fillColor(COLORS.gray).fontSize(10).font('Helvetica-Bold')
   .text('💡  Tips Clave', 58, doc.y - 10)
doc.fillColor(COLORS.dark).moveDown(0.15)

const tips = [
  'Siempre empieza con project-map en sesión nueva — ahorra muchos tokens',
  'Usa prompt-builder para tareas complejas — los resultados son mucho mejores',
  'Una tarea por conversación — cuando cambies de tema, nueva sesión + project-map',
  'Sé específico: "arregla el filtro en la línea 45" > "arregla el bug"',
]
tips.forEach(t => {
  doc.rect(50, doc.y, 4, 14).fill(COLORS.blue)
  doc.fillColor(COLORS.dark).fontSize(9).font('Helvetica')
     .text(t, 62, doc.y - 10, { width: W - 15 })
  doc.moveDown(0.25)
})

// ── Footer ───────────────────────────────────────────────
doc.rect(0, doc.page.height - 35, doc.page.width, 35).fill(COLORS.blue)
doc.fillColor('white').fontSize(8).font('Helvetica')
   .text('Nura VetCare · Claude Skills Reference · Generado automáticamente',
         50, doc.page.height - 20, { align: 'center', width: W })

doc.end()
console.log('PDF generado en:', output)
