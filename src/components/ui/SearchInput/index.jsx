import { Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'

export function SearchInput({ className = '', ...props }) {
  return (
    <Input
      icon={<Search size={15} className="text-[var(--text-3)]" />}
      className={`w-64 ${className}`}
      {...props}
    />
  )
}
