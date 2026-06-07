import { Card } from '../Card'

export function Drawer({ children, className = '' }) {
  return <Card className={`p-5 ${className}`}>{children}</Card>
}
