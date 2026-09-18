export type VenueId = 'sorbo' | 'bixi' | 'studio'
export type VenueKind = 'cafe' | 'cowork'
export type MenuCategory = 'cafe' | 'food'

export interface MenuItem {
  name: string
  description: string
  price: number
  tag?: string
}

export interface Venue {
  id: VenueId
  name: string
  kind: VenueKind
  subtitle: string
  address: string
  image: string
  imageAlt: string
  sponsor?: boolean
  tables: number
  initialOccupied: number
  wifi: number
  outlets: string
  noise: string
  hours: string
  description: string
  services: string[]
  trend: number[]
  menu: Record<MenuCategory, MenuItem[]>
}

export const venues: Venue[] = [
  {
    id: 'sorbo',
    name: 'Sorbo Specialty Coffee',
    kind: 'cafe',
    subtitle: 'Café de especialidad',
    address: 'Balcarce · Microcentro',
    image: '/images/sorbo.jpg',
    imageAlt: 'Interior de referencia de un café con mesas de madera y luz cálida',
    sponsor: true,
    tables: 14,
    initialOccupied: 5,
    wifi: 120,
    outlets: 'En cada mesa',
    noise: 'Música chill',
    hours: '08:00 – 21:00',
    description: 'Un buen café, luz natural y ese rincón donde las ideas fluyen. Una propuesta para trabajar a tu ritmo en pleno microcentro salteño.',
    services: ['Wi-Fi de fibra', 'Enchufes en cada mesa', 'Café de especialidad', 'Opciones vegetarianas'],
    trend: [15, 24, 43, 58, 49, 32, 26, 34, 52, 64, 45, 38, 27, 16],
    menu: {
      cafe: [
        { name: 'Flat white', description: 'Doble espresso y leche microespumada.', price: 3800, tag: 'El favorito' },
        { name: 'Filtrado V60', description: 'Origen de temporada. Notas frutales y final dulce.', price: 4200, tag: 'Especialidad' },
        { name: 'Americano', description: 'Espresso de la casa, agua caliente y nada más.', price: 3000 },
        { name: 'Iced latte', description: 'Espresso, leche y hielo para bajar un cambio.', price: 4100 },
      ],
      food: [
        { name: 'Croissant de almendras', description: 'Hojaldre artesanal, crema y almendras tostadas.', price: 4500, tag: 'Bakery' },
        { name: 'Avocado toast', description: 'Masa madre, palta, huevo y semillas.', price: 7200, tag: 'Brunch' },
        { name: 'Brownie de chocolate', description: 'Chocolate intenso y nueces.', price: 3500 },
      ],
    },
  },
  {
    id: 'bixi',
    name: 'Bixi Coffee',
    kind: 'cafe',
    subtitle: 'Coffee house & bakery',
    address: 'Balcarce 96 · Centro',
    image: '/images/bixi.jpg',
    imageAlt: 'Interior de referencia de una cafetería con barra y lámparas colgantes',
    tables: 12,
    initialOccupied: 8,
    wifi: 85,
    outlets: 'Limitados',
    noise: 'Concurrido',
    hours: '08:30 – 21:00',
    description: 'Pausa de café o tarde de estudio: un espacio con personalidad, aromas de panadería y energía de ciudad.',
    services: ['Wi-Fi', 'Panadería artesanal', 'Mesas compartidas', 'Opciones para llevar'],
    trend: [12, 31, 57, 72, 63, 48, 42, 56, 72, 83, 67, 54, 40, 22],
    menu: {
      cafe: [
        { name: 'Cappuccino', description: 'Espresso, leche cremosa y cacao.', price: 3500, tag: 'El favorito' },
        { name: 'Cold brew', description: 'Extracción en frío durante 16 horas.', price: 4300, tag: 'Especialidad' },
        { name: 'Té en hebras', description: 'Blend de frutos rojos o té verde.', price: 2800 },
      ],
      food: [
        { name: 'Roll de canela', description: 'Recién horneado con glaseado de vainilla.', price: 3800, tag: 'Bakery' },
        { name: 'Sándwich de campo', description: 'Pan artesanal, queso, tomate y rúcula.', price: 6500, tag: 'Almuerzo' },
        { name: 'Yogur con granola', description: 'Fruta de estación, miel y granola casera.', price: 4200 },
      ],
    },
  },
  {
    id: 'studio',
    name: 'STUDIO Coworking',
    kind: 'cowork',
    subtitle: 'Coworking & offices',
    address: 'Centro · Salta Capital',
    image: '/images/studio.jpg',
    imageAlt: 'Interior de referencia de un coworking luminoso con plantas',
    tables: 20,
    initialOccupied: 4,
    wifi: 300,
    outlets: 'En cada puesto',
    noise: 'Silencioso',
    hours: '08:00 – 21:00',
    description: 'Tu oficina por un día. Puestos cómodos, conexión rápida y un ambiente pensado para entrar en foco.',
    services: ['Fibra de 300 Mbps', 'Salas de reunión', 'Puestos dedicados', 'Café de cortesía', 'Cabinas para llamadas'],
    trend: [8, 19, 31, 40, 37, 24, 18, 22, 32, 36, 20, 15, 10, 5],
    menu: {
      cafe: [
        { name: 'Café de filtro', description: 'Disponible en la cocina compartida con tu pase.', price: 0, tag: 'Incluido' },
        { name: 'Té e infusiones', description: 'Una selección para acompañar tu jornada.', price: 0, tag: 'Incluido' },
      ],
      food: [
        { name: 'Mix de frutos secos', description: 'Un snack para mantener el foco.', price: 2500 },
        { name: 'Barrita de cereal', description: 'Avena, miel y chocolate.', price: 1800 },
      ],
    },
  },
]

export function occupancyPercent(occupied: number, tables: number) {
  return Math.round((occupied / tables) * 100)
}

export function occupancyStatus(percent: number) {
  if (percent < 50) return { label: 'Disponible', tone: 'green' } as const
  if (percent <= 80) return { label: 'Moderado', tone: 'amber' } as const
  return { label: 'Alta ocupación', tone: 'red' } as const
}

export const saltaHour = (date: Date) => Number(
  new Intl.DateTimeFormat('es-AR', { timeZone: 'America/Argentina/Salta', hour: 'numeric', hourCycle: 'h23' }).format(date),
)

export const currency = new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
})
