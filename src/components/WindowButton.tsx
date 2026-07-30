

export function WindowButton({ Icon, onClick }) {
  return (
    <button onClick={onClick}>
      { <Icon size={14} /> }
    </button>
  )
}
