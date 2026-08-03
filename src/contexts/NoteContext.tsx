import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type NoteContextType = {
  content: string
  setContent: (text: string) => void
}

export const NoteContext = createContext<NoteContextType | null>(null)

export function useNote() {
  const context = useContext(NoteContext)

  if (context === null)
    throw new Error("Note context cannot be accessed outside a NoteProvider children.")

  const { content, setContent } = context

  return { content, setContent }
}

export function NoteProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState("")

  return (
    <NoteContext value={{ content, setContent }}>
      { children }
    </NoteContext>
  )
}
