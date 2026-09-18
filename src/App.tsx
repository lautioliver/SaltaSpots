import { lazy, Suspense, useState } from 'react'
import { ArrowRight, Armchair, Bookmark, Building2, ChevronRight, CircleHelp, Coffee, Compass, Heart, MapPin, Pause, Play, Radio, Search, SlidersHorizontal, Sparkles, Sun, Wifi, X } from 'lucide-react'
import { venues } from './data'
import type { VenueId, VenueKind } from './data'
import { useLiveOccupancy } from './hooks/useLiveOccupancy'
import { useFavorites } from './hooks/useFavorites'
import { Dialog } from './components/Dialog'
import { VenueCard } from './components/VenueCard'
import { VenueDialog } from './components/VenueDialog'

const TrendChart = lazy(() => import('./components/TrendChart').then((module) => ({ default: module.TrendChart })))

function RadarMark({ className = '' }: { className?: string }) {
  return <span className={`radar-mark ${className}`} aria-hidden="true"><i /><i /><i /><b /></span>
}

function App() {
  const { occupancy, updatedAt, running, toggleRunning } = useLiveOccupancy()
  const { favorites, toggleFavorite } = useFavorites()
  const [view, setView] = useState<'radar' | 'saved'>('radar')
  const [kind, setKind] = useState<'all' | VenueKind>('all')
  const [query, setQuery] = useState('')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [selectedId, setSelectedId] = useState<VenueId | null>(null)
  const [chartId, setChartId] = useState<VenueId>('sorbo')
  const [showHelp, setShowHelp] = useState(false)

  const normalizedQuery = query.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  const visibleVenues = venues.filter((venue) => {
    const text = `${venue.name} ${venue.address} ${venue.subtitle}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    return (view === 'radar' || favorites.includes(venue.id))
      && (kind === 'all' || kind === venue.kind)
      && (!availableOnly || occupancy[venue.id] < venue.tables)
      && text.includes(normalizedQuery)
  })
  const selectedVenue = venues.find((venue) => venue.id === selectedId)
  const chartVenue = venues.find((venue) => venue.id === chartId) ?? venues[0]
  const freeTables = venues.reduce((sum, venue) => sum + venue.tables - occupancy[venue.id], 0)
  const averageWifi = Math.round(venues.reduce((sum, venue) => sum + venue.wifi, 0) / venues.length)
  const updateTime = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23', timeZone: 'America/Argentina/Salta' }).format(updatedAt)

  function resetFilters() {
    setKind('all')
    setQuery('')
    setAvailableOnly(false)
  }

  function changeView(next: 'radar' | 'saved') {
    setView(next)
    resetFilters()
  }

  function findSpot() {
    const best = venues.reduce((current, venue) => occupancy[venue.id] / venue.tables < occupancy[current.id] / current.tables ? venue : current)
    setSelectedId(best.id)
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Saltar al contenido</a>
      <aside className="sidebar">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); changeView('radar') }} aria-label="SaltaSpots, ir al radar"><RadarMark /><span>salta<span>spots</span><small>ENCONTRÁ TU LUGAR</small></span></a>
        <div className="sidebar-label">TU CIUDAD, A TU RITMO</div>
        <nav className="main-nav" aria-label="Navegación principal">
          <button className={view === 'radar' ? 'active' : ''} aria-label="Radar en vivo" onClick={() => changeView('radar')} aria-current={view === 'radar' ? 'page' : undefined}><Radio size={18} /><span>Radar en vivo</span><span className="nav-dot" /></button>
          <button className={view === 'saved' ? 'active' : ''} aria-label="Mis favoritos" onClick={() => changeView('saved')} aria-current={view === 'saved' ? 'page' : undefined}><Bookmark size={18} /><span>Mis favoritos</span>{favorites.length > 0 && <span className="nav-count">{favorites.length}</span>}</button>
          <button aria-label="Cómo funciona" onClick={() => setShowHelp(true)}><CircleHelp size={18} /><span>Cómo funciona</span></button>
        </nav>
        <div className="sidebar-bottom">
          <div className="city-card">
            <div className="city-sun"><Sun size={25} /></div>
            <span>MENOS RUTINA, MÁS SALTA</span>
            <p>El lugar cambia.<br />Las ideas fluyen.</p>
            <div className="mountains" aria-hidden="true"><i /><i /><i /></div>
          </div>
          <div className="local-profile"><span className="avatar"><Compass size={20} /></span><div><strong>Explorador local</strong><span>Tu ciudad tiene mucho para dar.</span></div></div>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb"><Compass size={16} /><span>Explorar</span><ChevronRight size={13} /><strong>{view === 'radar' ? 'Radar en vivo' : 'Mis favoritos'}</strong></div>
          <div className="topbar-right"><span className="location"><MapPin size={15} />Salta Capital, AR</span><span className="topbar-divider" /><span className="demo-pill">MODO DEMO</span></div>
        </header>
        <main id="main-content">
          <section className="page-heading">
            <div><div className="eyebrow"><span className="dot" />ESPACIOS REALES. POSIBILIDADES INFINITAS.</div><h1>{view === 'radar' ? <>Tu próximo spot <span>está acá.</span></> : <>Tus spots <span>favoritos.</span></>}</h1><p>{view === 'radar' ? 'Buen café, buena conexión y un lugar para hacer lo tuyo.' : 'Esos lugares a los que siempre querés volver.'}</p></div>
            <div className="live-control"><button onClick={toggleRunning} className={`live-button ${running ? '' : 'paused'}`} aria-label={running ? 'Pausar simulación en vivo' : 'Reanudar simulación en vivo'}><span className={`dot ${running ? 'live-dot' : ''}`} />{running ? 'Radar en vivo' : 'Radar pausado'}{running ? <Pause size={12} /> : <Play size={12} />}</button><span>{running ? 'Se actualiza cada 5 segundos' : 'La simulación está en pausa'}</span></div>
          </section>

          <section className="summary-grid" aria-label="Resumen de los tres espacios">
            <div className="summary-card"><span className="summary-icon green"><Armchair size={22} /></span><div><span>Un lugar te espera</span><p><strong>{freeTables}</strong>mesas disponibles</p></div><span className="summary-detail green"><span className="dot" />Ahora</span></div>
            <div className="summary-card"><span className="summary-icon blue"><Wifi size={22} /></span><div><span>Conectá con tus ideas</span><p><strong>{averageWifi}</strong>Mbps promedio</p></div><span className="summary-detail">Fibra óptica</span></div>
            <div className="summary-card"><span className="summary-icon amber"><Coffee size={22} /></span><div><span>Tu próxima oficina favorita</span><p><strong>3</strong>espacios para explorar</p></div><span className="summary-detail">En Salta</span></div>
          </section>

          <section className="spaces-section" aria-labelledby="spaces-title">
            <div className="section-title-row"><div className="flex items-center gap-2.5"><h2 id="spaces-title">{view === 'radar' ? 'Encontrá tu lugar' : 'Guardados para vos'}</h2><span className="count-badge">{visibleVenues.length}</span></div><span className="live-caption"><span className={`dot ${running ? 'green' : ''}`} />{running ? 'Disponibilidad simulada en vivo' : 'Actualizaciones en pausa'}</span></div>
            <div className="filter-bar">
              <div className="filter-tabs" aria-label="Tipo de espacio">
                <button className={kind === 'all' ? 'active' : ''} aria-pressed={kind === 'all'} onClick={() => setKind('all')}><Compass size={15} />Todos los espacios</button>
                <button className={kind === 'cafe' ? 'active' : ''} aria-pressed={kind === 'cafe'} onClick={() => setKind('cafe')}><Coffee size={15} />Cafeterías</button>
                <button className={kind === 'cowork' ? 'active' : ''} aria-pressed={kind === 'cowork'} onClick={() => setKind('cowork')}><Building2 size={15} />Coworking</button>
              </div>
              <div className="filter-actions"><div className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscá tu próximo spot..." aria-label="Buscar espacios" />{query && <button className="clear-search" onClick={() => setQuery('')} aria-label="Limpiar búsqueda"><X size={13} /></button>}</div><button className={`availability-filter ${availableOnly ? 'active' : ''}`} aria-pressed={availableOnly} aria-label="Mostrar solo espacios con mesas libres" title="Solo espacios con mesas libres" onClick={() => setAvailableOnly(!availableOnly)}><SlidersHorizontal size={17} /><span>Con lugar</span></button></div>
            </div>
            <div className="venue-grid">
              {visibleVenues.map((venue) => <VenueCard key={venue.id} venue={venue} occupied={occupancy[venue.id]} saved={favorites.includes(venue.id)} onSave={() => toggleFavorite(venue.id)} onOpen={() => setSelectedId(venue.id)} />)}
            </div>
            {visibleVenues.length === 0 && <div className="empty-state"><Search size={28} /><h3>{view === 'saved' && favorites.length === 0 ? 'Tu próximo favorito te está esperando' : 'No encontramos un spot con esos filtros'}</h3><p>{view === 'saved' && favorites.length === 0 ? 'Guardá los espacios que te gustan con el ícono de marcador.' : 'Probá con otro nombre o explorá todos los espacios.'}</p><button className="text-button" onClick={() => view === 'saved' && favorites.length === 0 ? changeView('radar') : resetFilters()}>Explorar espacios<ArrowRight size={15} /></button></div>}
            <div className="results-footer"><span><span className="dot" />{running ? `Última actualización: ${updateTime}` : `Pausado a las ${updateTime}`}<span className="timezone"> · hora de Salta</span></span><span>Un spot para cada forma de trabajar.</span></div>
          </section>

          <div className="bottom-grid">
            <Suspense fallback={<div className="trend-panel panel min-h-72" role="status">Cargando el pulso del día…</div>}><TrendChart venue={chartVenue} venues={venues} occupied={occupancy[chartVenue.id]} now={updatedAt} onSelect={setChartId} /></Suspense>
            <section className="discover-panel panel">
              <div className="mini-label"><Sparkles size={13} />UN CAMBIO DE AIRE</div>
              <h2>Grandes ideas.<br />Nuevos lugares.</h2>
              <p>Salí de la rutina. Tu mejor idea puede estar a un café de distancia.</p>
              <button onClick={findSpot}>Encontrá tu spot<ArrowUpRightIcon /></button>
              <div className="radar-art" aria-hidden="true"><div /><div /><div /><span className="radar-line" /><i className="point point-one" /><i className="point point-two" /><i className="point point-three" /><Coffee size={23} /></div>
            </section>
          </div>
          <footer className="footer"><span>Hecho con <Heart size={11} /> en Salta.<span className="footer-tagline"> Para gente que se mueve.</span></span><button onClick={() => setShowHelp(true)}>Sobre este proyecto<ArrowRight size={12} /></button></footer>
        </main>
      </div>
      {selectedVenue && <VenueDialog key={selectedVenue.id} venue={selectedVenue} occupied={occupancy[selectedVenue.id]} onClose={() => setSelectedId(null)} />}
      {showHelp && <Dialog labelledBy="help-title" onClose={() => setShowHelp(false)} className="help-dialog"><div className="help-content"><RadarMark /><div className="eyebrow">CONOCÉ SALTASPOTS</div><h2 id="help-title">Menos buscar.<br />Más disfrutar tu lugar.</h2><p>Explorá cafés y coworkings de Salta, compará sus servicios y guardá tus favoritos en este dispositivo.</p><div className="help-step"><span>01</span><div><h3>Mirá el radar</h3><p>La ocupación y las mesas libres cambian cada 5 segundos. Podés pausar el radar cuando quieras.</p></div></div><div className="help-step"><span>02</span><div><h3>Encontrá tu ritmo</h3><p>Verde: menos del 50% ocupado. Ámbar: del 50 al 80%. Rojo: más del 80%.</p></div></div><div className="help-step"><span>03</span><div><h3>Elegí con toda la info</h3><p>Abrí un espacio para explorar su café, comida y servicios. El gráfico muestra una curva horaria ilustrativa.</p></div></div><div className="help-disclaimer"><strong>Una prueba de concepto, hecha en Salta.</strong><p>La ocupación es simulada. Los menús, precios, horarios y servicios son ejemplos; las fotos son ilustrativas. “Spot destacado” es una muestra de patrocinio. No hay reservas ni pedidos reales. Confirmá la información con cada local antes de visitarlo.</p></div></div></Dialog>}
    </div>
  )
}

function ArrowUpRightIcon() {
  return <ArrowRight size={17} className="-rotate-45" />
}

export default App
