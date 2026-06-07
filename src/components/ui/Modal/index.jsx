import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '../Button'

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(event) => event.target === event.currentTarget && onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className={`max-h-[92svh] w-full overflow-auto rounded-3xl bg-white shadow-2xl ${maxWidth}`}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
              <h2 id="modal-title" className="text-lg font-extrabold text-slate-900">{title}</h2>
              <Button className="h-10 w-10 min-w-10 px-0" variant="ghost" aria-label="Cerrar" onClick={onClose}>
                <X size={18} />
              </Button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
