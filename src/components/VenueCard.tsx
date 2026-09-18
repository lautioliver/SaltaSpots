import { ArrowUpRight, Armchair, Bookmark, Coffee, Laptop, MapPin, PlugZap, Sparkles, Volume2, Wifi } from 'lucide-react'
import { occupancyPercent, occupancyStatus } from '../data'
import type { Venue } from '../data'

interface VenueCardProps {
  venue: Venue
  occupied: number
  saved: boolean
  onSave: () => void
  onOpen: () => void
}

export function VenueCard({ venue, occupied, saved, onSave, onOpen }: VenueCardProps) {
  const percent = occupancyPercent(occupied, venue.tables)
  const status = occupancyStatus(percent)
  return (
    <article className={`venue-card ${venue.sponsor ? 'sponsored' : ''}`}>
      <div className="venue-image">
        <img src={venue.image} alt={venue.imageAlt} width="600" height="360" />
        <div className="image-shade" />
        <span className={`image-badge ${venue.sponsor ? 'sponsor-badge' : ''}`}>
          {venue.sponsor ? <Sparkles size={12} /> : venue.kind === 'cafe' ? <Coffee size={13} /> : <Laptop size={13} />}
          {venue.sponsor ? 'SPOT DESTACADO' : venue.kind === 'cafe' ? 'CAFETERÍA' : 'COWORKING'}
        </span>
        <button className={`save-button ${saved ? 'saved' : ''}`} aria-label={`${saved ? 'Quitar de' : 'Guardar en'} favoritos: ${venue.name}`} aria-pressed={saved} onClick={onSave}>
          <Bookmark size={17} fill={saved ? 'currentColor' : 'none'} />
        </button>
        <span className="image-caption"><span className="dot" /> {venue.subtitle}</span>
      </div>
      <div className="venue-body">
        <h3>{venue.name}</h3>
        <p className="venue-address"><MapPin size={13} />{venue.address}</p>
        <div className="occupancy-block">
          <div className="flex items-center justify-between gap-2">
            <span className={`status-badge ${status.tone}`}><span className="dot" />{status.label}</span>
            <span className={`occupancy-number ${status.tone}`} key={occupied}><strong>{percent}%</strong><span>ocupado</span></span>
          </div>
          <div className="occupancy-track" role="meter" aria-label={`Ocupación de ${venue.name}`} aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
            <div className={status.tone} style={{ width: `${percent}%` }} />
          </div>
          <div className="table-count"><Armchair size={15} /><strong>{venue.tables - occupied} mesas libres</strong><span>de {venue.tables}</span><span className={`table-dots ${status.tone}`} aria-hidden="true"><i /><i /><i /></span></div>
        </div>
        <div className="venue-metrics">
          <div><Wifi size={17} /><strong>{venue.wifi} <span>Mbps</span></strong><small>Wi-Fi fibra</small></div>
          <div><PlugZap size={17} /><strong>{venue.outlets}</strong><small>Enchufes</small></div>
          <div><Volume2 size={17} /><strong>{venue.noise}</strong><small>Ambiente</small></div>
        </div>
        <button className={`menu-button ${venue.sponsor ? 'primary' : ''}`} onClick={onOpen}><Coffee size={16} />Ver menú y servicios<ArrowUpRight size={17} /></button>
      </div>
    </article>
  )
}
