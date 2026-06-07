import {
  Activity,
  BarChart3,
  CalendarDays,
  ClipboardList,
  HeartPulse,
  Home,
  Pill,
  Settings,
  UsersRound,
} from 'lucide-react'

export const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: Home },
  { label: 'Pacientes', path: '/pacientes', icon: HeartPulse },
  { label: 'Medicaciones', path: '/medicaciones', icon: Pill },
  { label: 'Propietarios', path: '/propietarios', icon: UsersRound },
  { label: 'Agenda', path: '/agenda', icon: CalendarDays },
  { label: 'Historial', path: '/historial', icon: ClipboardList },
  { label: 'Seguimientos', path: '/seguimientos', icon: Activity },
  { label: 'Reportes', path: '/reportes', icon: BarChart3 },
  { label: 'Configuracion', path: '/configuracion', icon: Settings },
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
  { id: 'luna', name: 'Luna', species: 'Canino', breed: 'Border Collie', age: '4 anos', weight: 18.6, status: 'Estable', ownerId: 'camila-torres', owner: 'Camila Torres', nextVisit: 'Hoy 3:30 PM', sex: 'Hembra', sterilized: true, color: 'Negro/Blanco', microchip: '900113004512345', lastVisit: '07 Jun 2025' },
  { id: 'milo', name: 'Milo', species: 'Felino', breed: 'Criollo', age: '2 anos', weight: 5.1, status: 'Observacion', ownerId: 'andres-gomez', owner: 'Andres Gomez', nextVisit: 'Manana 9:00 AM', sex: 'Macho', sterilized: true, color: 'Naranja', microchip: '900113004512346', lastVisit: '05 Jun 2025' },
  { id: 'kiara', name: 'Kiara', species: 'Canino', breed: 'Golden Retriever', age: '7 anos', weight: 28.4, status: 'Tratamiento', ownerId: 'sofia-mejia', owner: 'Sofia Mejia', nextVisit: 'Vie 11:20 AM', sex: 'Hembra', sterilized: false, color: 'Dorado', microchip: '900113004512347', lastVisit: '03 Jun 2025' },
  { id: 'nala', name: 'Nala', species: 'Felino', breed: 'Persa', age: '5 anos', weight: 4.8, status: 'Preventivo', ownerId: 'lucas-parra', owner: 'Lucas Parra', nextVisit: 'Lun 4:00 PM', sex: 'Hembra', sterilized: true, color: 'Gris', microchip: '900113004512348', lastVisit: '01 Jun 2025' },
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
