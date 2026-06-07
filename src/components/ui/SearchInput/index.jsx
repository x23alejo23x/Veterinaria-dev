import { Search } from 'lucide-react'
import { Input } from '../Input'

export function SearchInput(props) {
  return <Input icon={<Search size={17} />} className="w-full min-w-64 lg:w-80" {...props} />
}
