import { useId, useRef, useState } from 'react'
import { Armchair, Check, Clock3, Coffee, Info, MapPin, Utensils } from 'lucide-react'
import { currency, occupancyPercent, occupancyStatus } from '../data'
import type { Venue } from '../data'
import { Dialog } from './Dialog'

interface VenueDialogProps {
  venue: Venue
  occupied: number
  onClose: () => void
}

const tabs = [
  { id: 'cafe', label: 'Café', icon: Coffee },
  { id: 'food', label: 'Comida', icon: Utensils },
  { id: 'info', label: 'Info', icon: Info },
] as const

export function VenueDialog({ venue, occupied, onClose }: VenueDialogProps) {
  const [tab, setTab] = useState<'cafe' | 'food' | 'info'>('cafe')
  const id = useId()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const status = occupancyStatus(occupancyPercent(occupied, venue.tables))
  return (
    <Dialog labelledBy={`${id}-title`} onClose={onClose} className="venue-dialog">
      <div className="modal-cover"><img src={venue.image} alt={venue.imageAlt} /><div className="image-shade" /><span className="modal-cover-label">{venue.subtitle}</span></div>
      <div className="modal-content">
        <span className={`status-badge ${status.tone}`}><span className="dot" />{status.label} · {venue.tables - occupied} mesas libres</span>
        <h2 id={`${id}-title`}>{venue.name}</h2>
        <p className="venue-address"><MapPin size={14} />{venue.address}</p>
        <div className="modal-tabs" role="tablist" aria-label="Menú y servicios">
          {tabs.map(({ id: tabId, label, icon: Icon }, index) => (
            <button key={tabId} ref={(element) => { buttons.current[index] = element }} role="tab" id={`${id}-${tabId}-tab`} aria-selected={tab === tabId} aria-controls={`${id}-panel`} tabIndex={tab === tabId ? 0 : -1} className={tab === tabId ? 'active' : ''} onClick={() => setTab(tabId)}
              onKeyDown={(event) => {
                let next: number
                if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
                else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length
                else if (event.key === 'Home') next = 0
                else if (event.key === 'End') next = tabs.length - 1
                else return
                event.preventDefault()
                setTab(tabs[next].id)
                buttons.current[next]?.focus()
              }}
            ><Icon size={16} />{label}</button>
          ))}
        </div>
        <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${tab}-tab`} tabIndex={0} className="tab-content">
          {tab === 'info' ? (
            <div className="info-content">
              <p>{venue.description}</p>
              <div className="info-facts"><span><Clock3 size={17} />Horario de ejemplo: {venue.hours}</span><span><Armchair size={17} />{venue.tables} mesas · {venue.tables - occupied} disponibles</span></div>
              <h3>Todo lo que necesitás</h3>
              <div className="services-grid">{venue.services.map((service) => <span key={service}><Check size={15} />{service}</span>)}</div>
            </div>
          ) : (
            <>
              <div className="menu-category-heading"><h3>{tab === 'cafe' ? 'Cafetería & filtrados' : 'Bakery, brunch & almuerzos'}</h3><span>ARS</span></div>
              {venue.menu[tab].map((item) => <div className="menu-item" key={item.name}><div><h4>{item.name}{item.tag && <span>{item.tag}</span>}</h4><p>{item.description}</p></div><strong>{item.price ? currency.format(item.price) : 'Sin cargo'}</strong></div>)}
            </>
          )}
        </div>
        <p className="demo-note"><Info size={13} />Menú, precios, servicios e imágenes de ejemplo. Confirmá con el local.</p>
      </div>
    </Dialog>
  )
}
