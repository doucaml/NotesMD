import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type NoteContextType = {
  uid: string
  content: string
  setUid: (text: string) => void
  setContent: (text: string) => void
}

export const NoteContext = createContext<NoteContextType | null>(null)

export function useNote() {
  const context = useContext(NoteContext)

  if (context === null)
    throw new Error("Note context cannot be accessed outside a NoteProvider children.")

  const { uid, content, setUid, setContent } = context

  return { uid, content, setUid, setContent }
}

export function NoteProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState("")
  const [uid, setUid] = useState("")

  return (
    <NoteContext value={{ uid, content, setUid, setContent }}>
      { children }
    </NoteContext>
  )
}
