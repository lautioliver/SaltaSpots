import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface DialogProps {
  children: ReactNode
  labelledBy: string
  onClose: () => void
  className?: string
}

export function Dialog({ children, labelledBy, onClose, className = '' }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    const focused = document.activeElement
    dialog?.showModal()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      dialog?.close()
      document.body.style.overflow = overflow
      if (focused instanceof HTMLElement) focused.focus()
    }
  }, [])

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      className={`dialog ${className}`}
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <div className="dialog-inner">
        <button className="icon-button dialog-close" onClick={onClose} aria-label="Cerrar ventana"><X size={20} /></button>
        {children}
      </div>
    </dialog>
  )
}
