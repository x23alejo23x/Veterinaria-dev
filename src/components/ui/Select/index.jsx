import { motion, useReducedMotion } from 'framer-motion'
import { ListBox, Select as HeroSelect } from '@heroui/react'
import { Combobox } from '@/components/ui/Combobox'

/**
 * Select — HeroUI normal o Combobox con búsqueda según prop `searchable`.
 * API: options=[string|{value,label}], value, onChange({target:{value}}), searchable?
 *
 * Prop `compact` — modo pill inline para usar dentro de cards/badges.
 * Prop `triggerClass` — clases extra para el trigger (útil para colores dinámicos en compact).
 */
export function Select({ options = [], value, onChange, placeholder = 'Seleccionar…', required, className = '', icon, searchable = false, compact = false, triggerClass = '' }) {
  // Modo búsqueda → delegar al Combobox
  if (searchable) {
    return <Combobox options={options} value={value} onChange={onChange} placeholder={placeholder} required={required} className={className} />
  }
  const reduced = useReducedMotion()
  const items = options.map((o) => typeof o === 'string' ? { value: o, label: o } : o)

  if (compact) {
    return (
      <HeroSelect
        selectedKey={value || null}
        onSelectionChange={(key) => onChange?.({ target: { value: key ?? '' } })}
        size="sm"
        variant="flat"
        aria-label="Cambiar estado"
        classNames={{
          base:         'w-[110px]',
          trigger:      `h-auto min-h-0 rounded-full px-2.5 py-1 border-0 shadow-none gap-1 ${triggerClass}`,
          value:        'text-[10px] font-bold',
          selectorIcon: 'w-3 h-3',
          popoverContent: [
            'rounded-xl border border-[var(--border)] bg-[var(--surface)]',
            'shadow-[var(--shadow-lg)] min-w-[140px]',
          ].join(' '),
        }}
      >
        <HeroSelect.Trigger>
          <HeroSelect.Value />
          <HeroSelect.Indicator />
        </HeroSelect.Trigger>
        <HeroSelect.Popover>
          <ListBox>
            {items.map((item) => (
              <ListBox.Item
                key={item.value}
                id={item.value}
                textValue={item.label}
                className="rounded-lg px-3 py-2 text-sm text-[var(--text)] transition-colors hover:bg-[var(--primary-10)] hover:text-[var(--primary)] data-[selected=true]:bg-[var(--primary-10)] data-[selected=true]:text-[var(--primary)] data-[selected=true]:font-semibold"
              >
                {item.label}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </HeroSelect.Popover>
      </HeroSelect>
    )
  }

  return (
    <motion.div
      whileFocus={reduced ? {} : { scale: 1.005 }}
      transition={{ duration: 0.15 }}
      className={className}
    >
      <HeroSelect
        selectedKey={value || null}
        onSelectionChange={(key) => onChange?.({ target: { value: key ?? '' } })}
        placeholder={placeholder}
        isRequired={required}
        size="sm"
        variant="bordered"
        classNames={{
          trigger: [
            'rounded-xl border-[var(--border)] bg-[var(--surface-2)]',
            'data-[focus=true]:border-violet-500 data-[focus=true]:ring-2 data-[focus=true]:ring-violet-500/15',
            'transition-all duration-150',
          ].join(' '),
          value: 'text-sm text-[var(--text)]',
          placeholder: 'text-[var(--text-3)] text-sm',
          popoverContent: [
            'rounded-xl border border-[var(--border)] bg-[var(--surface)]',
            'shadow-[var(--shadow-lg)]',
          ].join(' '),
        }}
      >
        <HeroSelect.Trigger>
          <HeroSelect.Value />
          <HeroSelect.Indicator />
        </HeroSelect.Trigger>
        <HeroSelect.Popover>
          <ListBox>
            {items.map((item) => (
              <ListBox.Item
                key={item.value}
                id={item.value}
                textValue={item.label}
                className="rounded-lg px-3 py-2 text-sm text-[var(--text)] transition-colors hover:bg-[var(--primary-10)] hover:text-[var(--primary)] data-[selected=true]:bg-[var(--primary-10)] data-[selected=true]:text-[var(--primary)] data-[selected=true]:font-semibold"
              >
                {item.label}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </HeroSelect.Popover>
      </HeroSelect>
    </motion.div>
  )
}
