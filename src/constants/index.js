import {
  Activity,
  BarChart3,
  CalendarDays,
  ClipboardList,
  HeartPulse,
  Home,
  Pill,
  Settings,
  Shield,
  UsersRound,
} from 'lucide-react'

export const navItems = [
  { label: 'Dashboard',     path: '/dashboard',    icon: Home },
  { label: 'Pacientes',     path: '/pacientes',    icon: HeartPulse },
  { label: 'Medicaciones',  path: '/medicaciones', icon: Pill },
  { label: 'Propietarios',  path: '/propietarios', icon: UsersRound },
  { label: 'Agenda',        path: '/agenda',       icon: CalendarDays },
  { label: 'Historial',     path: '/historial',    icon: ClipboardList },
  { label: 'Seguimientos',  path: '/seguimientos', icon: Activity },
  { label: 'Reportes',      path: '/reportes',     icon: BarChart3 },
  { label: 'Configuracion', path: '/configuracion',icon: Settings },
  { label: 'Admin SaaS',    path: '/admin',        icon: Shield },
]

export const userProfile = {
  name: 'Dra. Valentina Rios',
  role: 'Medicina interna',
  initials: 'VR',
  clinic: 'Nura VetCare',
}

export const ownersSeed = [
  { id: 'camila-torres', name: 'Camila Torres', phone: '+57 300 123 4567', email: 'camila.torres@email.com', balance: 0, balanceStr: '$0', address: 'Calle 45 #12-34, Bogota', lastContact: 'Hoy' },
  { id: 'andres-gomez', name: 'Andres Gomez', phone: '+57 310 555 8042', email: 'andres.gomez@email.com', balance: 86000, balanceStr: '$86.000', address: 'Carrera 8 #23-45, Bogota', lastContact: 'Ayer' },
  { id: 'sofia-mejia', name: 'Sofia Mejia', phone: '+57 301 777 2211', email: 'sofia.mejia@email.com', balance: 0, balanceStr: '$0', address: 'Avenida 68 #45-12, Bogota', lastContact: 'Hace 3 dias' },
  { id: 'lucas-parra', name: 'Lucas Parra', phone: '+57 315 908 3321', email: 'lucas.parra@email.com', balance: 42000, balanceStr: '$42.000', address: 'Calle 100 #15-20, Bogota', lastContact: 'Hace 5 dias' },
]

export const patientsSeed = [
  { id: 'luna',   name: 'Luna',   species: 'Canino', breed: 'Border Collie',    age: '4 años', weight: 18.6, status: 'Estable',    ownerId: 'camila-torres', owner: 'Camila Torres', nextVisit: 'Hoy 3:30 PM',    sex: 'Hembra', sterilized: true,  color: 'Negro/Blanco', microchip: '900113004512345', lastVisit: '07 Jun 2025' },
  { id: 'milo',   name: 'Milo',   species: 'Felino', breed: 'Criollo',          age: '2 años', weight: 5.1,  status: 'Observacion', ownerId: 'andres-gomez',  owner: 'Andres Gomez',  nextVisit: 'Mañana 9:00 AM', sex: 'Macho',  sterilized: true,  color: 'Naranja',      microchip: '900113004512346', lastVisit: '05 Jun 2025' },
  { id: 'kiara',  name: 'Kiara',  species: 'Canino', breed: 'Golden Retriever', age: '7 años', weight: 28.4, status: 'Tratamiento', ownerId: 'sofia-mejia',   owner: 'Sofia Mejia',   nextVisit: 'Vie 11:20 AM',   sex: 'Hembra', sterilized: false, color: 'Dorado',       microchip: '900113004512347', lastVisit: '03 Jun 2025' },
  { id: 'nala',   name: 'Nala',   species: 'Felino', breed: 'Persa',            age: '5 años', weight: 4.8,  status: 'Preventivo',  ownerId: 'lucas-parra',   owner: 'Lucas Parra',   nextVisit: 'Lun 4:00 PM',    sex: 'Hembra', sterilized: true,  color: 'Gris',         microchip: '900113004512348', lastVisit: '01 Jun 2025' },
  { id: 'thor',   name: 'Thor',   species: 'Canino', breed: 'Labrador',         age: '3 años', weight: 32.0, status: 'Estable',    ownerId: 'camila-torres', owner: 'Camila Torres', nextVisit: 'Mié 10:00 AM',   sex: 'Macho',  sterilized: false, color: 'Amarillo',     microchip: '900113004512349', lastVisit: '02 Jun 2025' },
  { id: 'cleo',   name: 'Cleo',   species: 'Felino', breed: 'Siamés',           age: '1 año',  weight: 3.2,  status: 'Estable',    ownerId: 'andres-gomez',  owner: 'Andres Gomez',  nextVisit: 'Jue 2:00 PM',    sex: 'Hembra', sterilized: true,  color: 'Crema/Café',   microchip: '900113004512350', lastVisit: '30 May 2025' },
  { id: 'rocky',  name: 'Rocky',  species: 'Canino', breed: 'Bulldog Francés',  age: '4 años', weight: 12.8, status: 'Tratamiento', ownerId: 'sofia-mejia',   owner: 'Sofia Mejia',   nextVisit: 'Vie 9:30 AM',    sex: 'Macho',  sterilized: true,  color: 'Atigrado',     microchip: '900113004512351', lastVisit: '28 May 2025' },
  { id: 'bella',  name: 'Bella',  species: 'Canino', breed: 'Beagle',           age: '6 años', weight: 14.5, status: 'Preventivo',  ownerId: 'lucas-parra',   owner: 'Lucas Parra',   nextVisit: 'Lun 11:00 AM',   sex: 'Hembra', sterilized: true,  color: 'Tricolor',     microchip: '900113004512352', lastVisit: '25 May 2025' },
  { id: 'simba',  name: 'Simba',  species: 'Felino', breed: 'Maine Coon',       age: '3 años', weight: 7.1,  status: 'Estable',    ownerId: 'camila-torres', owner: 'Camila Torres', nextVisit: 'Mar 3:00 PM',    sex: 'Macho',  sterilized: false, color: 'Dorado',       microchip: '900113004512353', lastVisit: '22 May 2025' },
  { id: 'lola',   name: 'Lola',   species: 'Canino', breed: 'Poodle',           age: '5 años', weight: 6.3,  status: 'Estable',    ownerId: 'andres-gomez',  owner: 'Andres Gomez',  nextVisit: 'Mié 4:30 PM',    sex: 'Hembra', sterilized: true,  color: 'Blanco',       microchip: '900113004512354', lastVisit: '20 May 2025' },
  { id: 'max',    name: 'Max',    species: 'Canino', breed: 'Pastor Alemán',    age: '2 años', weight: 30.5, status: 'Observacion', ownerId: 'sofia-mejia',   owner: 'Sofia Mejia',   nextVisit: 'Jue 8:00 AM',    sex: 'Macho',  sterilized: false, color: 'Negro/Café',   microchip: '900113004512355', lastVisit: '18 May 2025' },
  { id: 'kira',   name: 'Kira',   species: 'Felino', breed: 'Bengalí',          age: '2 años', weight: 4.1,  status: 'Estable',    ownerId: 'lucas-parra',   owner: 'Lucas Parra',   nextVisit: 'Vie 1:00 PM',    sex: 'Hembra', sterilized: true,  color: 'Moteado',      microchip: '900113004512356', lastVisit: '15 May 2025' },
]

export const medicationsSeed = [
  { id: 'omeprazol', name: 'Omeprazol', concentration: 10, unit: 'mg/ml', category: 'Gastroprotector' },
  { id: 'amoxicilina', name: 'Amoxicilina', concentration: 50, unit: 'mg/ml', category: 'Antibiotico' },
  { id: 'meloxicam', name: 'Meloxicam', concentration: 1.5, unit: 'mg/ml', category: 'Antiinflamatorio' },
]

export const prescriptionsSeed = [
  { id: 'rx-luna-omeprazol', patientId: 'luna', medicationId: 'omeprazol', dose: '1.8 ml', frequency: 'cada 12 horas', duration: '5 dias', status: 'Activa', date: '07 Jun 2025' },
  { id: 'rx-kiara-meloxicam', patientId: 'kiara', medicationId: 'meloxicam', dose: '1.4 ml', frequency: 'cada 24 horas', duration: '10 dias', status: 'Activa', date: '03 Jun 2025' },
]

export const medicalTimeline = [
  { date: '07 Jun', diagnosis: 'Gastritis leve', procedure: 'Ecografia abdominal y control de hidratacion', vet: 'Dra. Valentina Rios', notes: 'Buena respuesta al manejo inicial. Control en 72 horas.', patient: 'Luna' },
  { date: '22 May', diagnosis: 'Profilaxis dental', procedure: 'Limpieza ultrasonica y pulido', vet: 'Dr. Mateo Silva', notes: 'Sin complicaciones. Recomendado gel dental nocturno.', patient: 'Milo' },
  { date: '12 Abr', diagnosis: 'Vacunacion anual', procedure: 'Polivalente + antirrabica', vet: 'Dra. Valentina Rios', notes: 'Paciente tolera aplicacion sin reacciones inmediatas.', patient: 'Kiara' },
]

export const visitChart = [
  { day: 'Lun', citas: 18, altas: 10 },
  { day: 'Mar', citas: 24, altas: 13 },
  { day: 'Mie', citas: 20, altas: 12 },
  { day: 'Jue', citas: 32, altas: 18 },
  { day: 'Vie', citas: 28, altas: 17 },
  { day: 'Sab', citas: 21, altas: 9 },
]

export const followUps = {
  Pendiente: [
    { title: 'Control gastritis', patient: 'Luna', due: 'Hoy', priority: 'Alta' },
    { title: 'Lectura examenes', patient: 'Milo', due: 'Manana', priority: 'Media' },
  ],
  'En proceso': [
    { title: 'Plan de perdida de peso', patient: 'Kiara', due: 'Viernes', priority: 'Media' },
    { title: 'Terapia renal', patient: 'Nala', due: 'Lunes', priority: 'Alta' },
  ],
}

export const companiesSeed = [
  { id: 'nura-vetcare',   name: 'Nura VetCare',     owner: 'Valentina Rios',    email: 'admin@nuravet.com',     plan: 'Pro',        status: 'Activa',    patients: 12, maxPatients: 50,  users: 4, maxUsers: 10, created: '2025-01-15', city: 'Bogotá' },
  { id: 'clinica-huella', name: 'Clínica Huella',   owner: 'Carlos Mendez',     email: 'admin@huella.com',      plan: 'Básico',     status: 'Activa',    patients: 8,  maxPatients: 20,  users: 2, maxUsers: 3,  created: '2025-02-20', city: 'Medellín' },
  { id: 'vetplus',        name: 'VetPlus Cali',     owner: 'Ana Gutierrez',     email: 'ana@vetplus.com',       plan: 'Enterprise', status: 'Activa',    patients: 47, maxPatients: 200, users: 9, maxUsers: 25, created: '2024-11-03', city: 'Cali' },
  { id: 'patitas-feliz',  name: 'Patitas Feliz',    owner: 'Juan Restrepo',     email: 'juan@patitas.com',      plan: 'Básico',     status: 'Trial',     patients: 3,  maxPatients: 10,  users: 1, maxUsers: 2,  created: '2025-06-01', city: 'Barranquilla' },
  { id: 'animalcare-pro', name: 'AnimalCare Pro',   owner: 'Sofia Vargas',      email: 'sofia@animalcare.com',  plan: 'Pro',        status: 'Activa',    patients: 29, maxPatients: 50,  users: 5, maxUsers: 10, created: '2025-03-10', city: 'Bucaramanga' },
  { id: 'vetmaster',      name: 'VetMaster',        owner: 'Luis Herrera',      email: 'luis@vetmaster.com',    plan: 'Pro',        status: 'Inactiva',  patients: 15, maxPatients: 50,  users: 3, maxUsers: 10, created: '2024-09-22', city: 'Pereira' },
]

export const billingData = {
  mesActual:    { label: 'Jun 2025', total: 2_480_000,  pagado: 1_850_000,  pendiente: 630_000 },
  mesPasado:    { label: 'May 2025', total: 3_120_000,  pagado: 3_120_000,  pendiente: 0 },
  tendencia: +12,
  servicios: [
    { concepto: 'Consultas generales',       cantidad: 18, monto: 900_000, color: '#2563eb' },
    { concepto: 'Cirugías y procedimientos', cantidad: 4,  monto: 680_000, color: '#7c3aed' },
    { concepto: 'Medicamentos despachados',  cantidad: 12, monto: 480_000, color: '#10b981' },
    { concepto: 'Exámenes diagnósticos',     cantidad: 7,  monto: 420_000, color: '#f59e0b' },
  ],
  ingresosDiarios: [
    { dia: 'Lun 2',  monto: 320_000 },
    { dia: 'Mar 3',  monto: 450_000 },
    { dia: 'Mié 4',  monto: 280_000 },
    { dia: 'Jue 5',  monto: 510_000 },
    { dia: 'Vie 6',  monto: 390_000 },
    { dia: 'Sáb 7',  monto: 180_000 },
    { dia: 'Lun 9',  monto: 350_000 },
  ],
}

export const novedades = [
  { tipo: 'paciente',     texto: 'Thor registrado como nuevo paciente',        tiempo: 'Hace 2h',    tono: 'blue' },
  { tipo: 'prescripcion', texto: 'Prescripción emitida para Luna · Omeprazol', tiempo: 'Hace 3h',    tono: 'green' },
  { tipo: 'alerta',       texto: 'Control de gastritis pendiente · Luna',      tiempo: 'Hace 4h',    tono: 'rose' },
  { tipo: 'paciente',     texto: 'Cleo actualizada — nuevo peso registrado',   tiempo: 'Ayer 6:20',  tono: 'blue' },
  { tipo: 'historial',    texto: 'Profilaxis dental completada · Milo',        tiempo: 'Ayer 2:00',  tono: 'green' },
]
