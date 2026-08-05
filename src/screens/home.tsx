import { emit, listen, type UnlistenFn } from "@tauri-apps/api/event";
import { BaseDirectory } from "@tauri-apps/api/path";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { exists, mkdir, readDir, readTextFile, remove } from "@tauri-apps/plugin-fs";
import { Pen, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";


export const URL_BASE = window.location.origin
export const NOTES_DIR = "notes/"

const openNoteWindow = async (uid: string | null, inEditorMode: Boolean = false) => {
  const windowLabel =  uid || "new-note"

  const route = uid ? uid : "new"
  const url = URL_BASE + "/notes/" + route + (inEditorMode ? "?mode=editor" : "")

  const windowOptions = {
    title: 'Note - notes.md',
    decorations: false,
    width: 500,
    height: 500,
    backgroundColor: '#fef9c3'
  }

  const noteWebView = await WebviewWindow.getByLabel(windowLabel)

  if (noteWebView !== null)
    await noteWebView.setFocus()

  else
    new WebviewWindow(
      windowLabel,
      { url, ...windowOptions }
    )
}

const deleteNote = async (uid: string) => {
  const filePath = NOTES_DIR + uid + ".md"
  await remove(filePath, { baseDir: BaseDirectory.AppData })
}

const getOrCreateNotesDir = async () => {
  const alreadyExist = await exists(NOTES_DIR, { baseDir: BaseDirectory.AppData })

  if (!alreadyExist)
    await mkdir(NOTES_DIR, { baseDir: BaseDirectory.AppData })

  const dir = await readDir(NOTES_DIR, { baseDir: BaseDirectory.AppData })

  return dir
}

const getData = async () => {
  const files = (await getOrCreateNotesDir())
    .filter((entry) => entry.isFile && entry.name.endsWith(".md"))
    .map(entry => entry.name)

  const data = []

  for (const file of files) {
    const filePath = NOTES_DIR + file
    const content = await readTextFile(filePath, { baseDir: BaseDirectory.AppData })

    data.push({
      name: file.slice(0, -3),
      content: content
    })
  }

  return data
}

export default function Home() {
  const [notes, setNotes] = useState<{ name: string, content: string }[]>([])

  const getNotes = async () => {
    const data = await getData()
    setNotes(data)
  }

  const onDelete = async (name: string) => {
    await deleteNote(name)
    await emit("notes-reload-signal")
  }

  useEffect(() => {


    let unlistenFn: UnlistenFn

    const listenSignal = async () => {
      unlistenFn = await listen("notes-reload-signal", () => {
        getNotes()
      })
    }

    getNotes()
    listenSignal()

    return () => {
      if (unlistenFn)
        unlistenFn()
    }
  }, [])

  return (
    <div className="h-full flex flex-col overflow-hidden gap-y-4" >
      <div className="flex justify-between items-center h-10">
        <h1 className="font-bold text-xl">notes.md</h1>

        {
          notes.length !== 0 &&

          < button
            className="p-2 w-fit ml-auto rounded-lg cursor-pointer bg-blue-600 text-white"
            onClick={() => openNoteWindow(null)}
          >
            <Plus />
          </button >
        }
      </div>

      {
        notes.length === 0 ?
        <div className="m-auto flex flex-col items-center gap-y-8">
          <p>No note for now</p>
            <button
              className="p-2 bg-blue-500 text-white font-bold rounded-md"
              onClick={() => openNoteWindow(null)}
            >
              Create a note
            </button>
        </div>
        :
        <div className="flex-1 flex flex-col gap-y-4 overflow-y-auto">
          <div className="flex flex-col gap-y-6">
            {
              notes
              .map((note, key) => (
                <div
                  className="flex flex-col p-1 gap-y-2"
                  key={key}
                >
                  <div className="bg-yellow-100 rounded-lg h-48 p-2 ">
                    <div
                      onClick={() => openNoteWindow(note.name)}
                      className="
                      h-full overflow-hidden cursor-pointer
                      prose prose-sm prose-h1:text-[21px]
                      prose-li:marker:text-black
                      "
                    >
                      <Markdown remarkPlugins={[remarkGfm]}>
                        {note.content}
                      </Markdown>
                    </div>
                  </div>

                  <div className="flex justify-end gap-x-4">
                    <button
                      className="p-2 cursor-pointer bg-gray-200 hover:bg-gray-500 rounded-md hover:text-white"
                      onClick={() => openNoteWindow(note.name, true)}
                    >
                      <Pen />
                    </button>

                    <button
                      className="p-2 cursor-pointer bg-gray-200 hover:bg-red-500 rounded-md hover:text-white"
                      onClick={() => onDelete(note.name)}
                    >
                      <Trash />
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      }

    </div>
  )
}
