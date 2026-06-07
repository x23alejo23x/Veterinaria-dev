import { CalendarDays } from 'lucide-react'
import { Input } from '../Input'

export function DatePicker(props) {
  return <Input icon={<CalendarDays size={17} />} type="date" {...props} />
}
