import { useId } from 'react'
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowDownRight, ChartNoAxesCombined } from 'lucide-react'
import { occupancyPercent, saltaHour } from '../data'
import type { Venue, VenueId } from '../data'

interface TrendChartProps {
  venue: Venue
  venues: Venue[]
  occupied: number
  now: Date
  onSelect: (id: VenueId) => void
}

export function TrendChart({ venue, venues, occupied, now, onSelect }: TrendChartProps) {
  const gradient = useId().replaceAll(':', '')
  const hour = saltaHour(now)
  const inHours = hour >= 8 && hour <= 21
  const data = venue.trend.map((value, index) => ({
    hour: index + 8,
    occupancy: index + 8 === hour ? occupancyPercent(occupied, venue.tables) : value,
  }))
  return (
    <section className="trend-panel panel" aria-labelledby="trend-title">
      <div className="panel-heading">
        <div><h2 id="trend-title"><ChartNoAxesCombined size={18} />El pulso del día</h2><p>Un poco de contexto para elegir tu mejor momento.</p></div>
        <select aria-label="Espacio del gráfico de ocupación" value={venue.id} onChange={(event) => onSelect(event.target.value as VenueId)}>
          {venues.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </div>
      <div className="chart-meta"><span><i />Ocupación estimada</span><span><ArrowDownRight size={14} />Menos gente, más foco</span></div>
      <div className="chart-container" role="img" aria-label={`Gráfico de ocupación simulada de ${venue.name}, de 8 a 21 horas. ${inHours ? `Ahora: ${occupancyPercent(occupied, venue.tables)}%.` : 'Fuera del horario mostrado.'}`}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={data} margin={{ top: 25, right: 12, left: -22, bottom: 0 }}>
            <defs><linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#58ddb0" stopOpacity={0.25} /><stop offset="100%" stopColor="#58ddb0" stopOpacity={0.005} /></linearGradient></defs>
            <CartesianGrid stroke="#243042" strokeDasharray="3 5" vertical={false} />
            <XAxis dataKey="hour" type="number" domain={[8, 21]} ticks={[8, 10, 12, 14, 16, 18, 21]} tickFormatter={(value: number) => `${value}:00`} axisLine={false} tickLine={false} tick={{ fill: '#8b99ac', fontSize: 10 }} dy={10} />
            <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={(value: number) => `${value}%`} axisLine={false} tickLine={false} tick={{ fill: '#7e8da2', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#152132', border: '1px solid #344357', borderRadius: 10, fontSize: 12 }} labelFormatter={(value) => `${value}:00 h`} formatter={(value) => [`${value}%`, 'Ocupación']} />
            <Area type="monotone" dataKey="occupancy" stroke="#58ddb0" fill={`url(#${gradient})`} strokeWidth={2.5} animationDuration={450} />
            {inHours && <ReferenceLine x={hour} stroke="#58ddb0" strokeDasharray="3 4" label={{ value: 'AHORA', position: 'top', fill: '#58ddb0', fontSize: 9 }} />}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="chart-footnote">Hora local de Salta · Curva ilustrativa, datos simulados{!inHours && ' · Fuera del horario 08–21 h'}</p>
    </section>
  )
}
