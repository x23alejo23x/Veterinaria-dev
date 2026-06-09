import { ListBox, Select as HeroSelect } from '@heroui/react'

/**
 * options: string[] | { value: string; label: string }[]
 * value / onChange({ target: { value } })
 */
export function Select({ options = [], value, onChange, placeholder = 'Seleccionar…', required, className = '', icon }) {
  const items = options.map((o) =>
    typeof o === 'string' ? { value: o, label: o } : o
  )

  return (
    <HeroSelect
      selectedKey={value || null}
      onSelectionChange={(key) => onChange?.({ target: { value: key ?? '' } })}
      placeholder={placeholder}
      isRequired={required}
      className={className}
      size="sm"
      variant="bordered"
    >
      <HeroSelect.Trigger>
        <HeroSelect.Value />
        <HeroSelect.Indicator />
      </HeroSelect.Trigger>
      <HeroSelect.Popover>
        <ListBox>
          {items.map((item) => (
            <ListBox.Item key={item.value} id={item.value} textValue={item.label}>
              {item.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </HeroSelect.Popover>
    </HeroSelect>
  )
}
