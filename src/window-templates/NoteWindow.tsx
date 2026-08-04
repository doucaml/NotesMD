import { Outlet } from "react-router";
import { WindowButton } from "../components/WindowButton";
import { Minus, X } from "lucide-react";
import { closeWindow, minimizeWindow } from "../utils/window-tab-helper";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { open, remove } from "@tauri-apps/plugin-fs";
import { DIR_PATH_KEY } from "../screens/home";
import { useNote } from "../contexts/NoteContext";
import { emit } from "@tauri-apps/api/event";

const saveNote = async (content: string, uid: string | null) => {
  let filePath = localStorage.getItem(DIR_PATH_KEY)

  if (uid)
    filePath += ("/" + uid + ".md")

  else {
    const dateTimeString = new Date().toISOString().replace(/\D/g, "")
    filePath += "/note-" + dateTimeString + ".md"
  }

  if (filePath) {
    if (uid && content.trim().length !== 0) {
      const file = await open(filePath, {
        write: true,
        truncate: true
      })

      await file.write(new TextEncoder().encode(content))
      await file.close()
    }

    else if (uid && content.trim().length === 0) {
      await remove(filePath)
    }

    else if (!uid && content.trim().length !== 0) {
      const file = await open(filePath, {
        write: true,
        create: true,
        truncate: true
      })

      await file.write(new TextEncoder().encode(content))
      await file.close()
    }

    await emit("notes-reload-signal")
  }
}

export default function NoteWindow() {
  const { content } = useNote()

  const onWindowClose = async () => {
    const label = getCurrentWindow().label

    if (label !== "new-note")
      await saveNote(content, label)

    else
      await saveNote(content, null)

    await closeWindow()
  }

  return (
    <>
      <header className="bg-gray-200 h-8 flex-none flex select-none">
        <div className="w-full" data-tauri-drag-region />

        <div className="flex justify-around w-12 h-full">
          <WindowButton Icon={Minus} onClick={minimizeWindow} />
          <WindowButton Icon={X} onClick={onWindowClose} />
        </div>
      </header>

      <main className="bg-yellow-100 flex-1 p-1">
        <Outlet />
      </main>
    </>
  )
}
