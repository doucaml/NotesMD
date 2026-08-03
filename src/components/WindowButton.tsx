import type { LucideIcon } from "lucide-react";


export function WindowButton({ Icon, onClick } : { Icon: LucideIcon, onClick: () => void }) {
  return (
    <button onClick={onClick}>
      { <Icon size={14} /> }
    </button>
  )
}
