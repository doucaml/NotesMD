import { emit, listen, type UnlistenFn } from "@tauri-apps/api/event";
import { homeDir } from "@tauri-apps/api/path";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { open } from '@tauri-apps/plugin-dialog';
import { readDir, readTextFile, remove } from "@tauri-apps/plugin-fs";
import { Pen, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";


export const DIR_PATH_KEY = "NOTES_DIR_PATH"
export const URL_BASE = window.location.origin

const openNoteWindow = async (uid: string | null, inEditorMode: boolean = false) => {
  const windowLabel = uid || "new-note"

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
  const dirPath = localStorage.getItem(DIR_PATH_KEY)
  if (!dirPath) throw new Error("notes folders not found.")

  const filePath = dirPath  + "/" + uid + ".md"
  await remove(filePath)
}

const openDialog = async () => {
  const homeDirPath = await homeDir()
  const filePath = await open({
    multiple: false,
    directory: true,
    defaultPath: homeDirPath
  })

  if (filePath) {
    localStorage.setItem(DIR_PATH_KEY, filePath)
    await emit("notes-reload-signal")
  }
}

const getData = async () => {
  const dirPath = localStorage.getItem(DIR_PATH_KEY)
  if (!dirPath) throw new Error("notes folders not found.")

  const files = (await readDir(dirPath))
    .filter((entry) => entry.isFile && entry.name.endsWith(".md"))
    .map(entry => entry.name)

  const data = []

  for (const file of files) {
    const filePath = localStorage.getItem(DIR_PATH_KEY) + `/${file}`
    const content = await readTextFile(filePath)

    data.push({
      name: file.slice(0, -3),
      content: content
    })
  }

  return data
}

export default function Home() {
  const dirPath = useMemo(() => localStorage.getItem(DIR_PATH_KEY), [])
  const isDirPicked = dirPath !== null

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
    if (!dirPath) return

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
            className="p-2 w-fit ml-auto bg-blue-600 text-white"
            onClick={() => openNoteWindow(null)}
          >
            <Plus />
          </button >
        }
      </div>

      {
        !isDirPicked ?
        <div className="flex-1 flex">
          <div className="flex m-auto flex-col gap-y-4">
            <h1 className="">Choose a folder where your notes will be saved</h1>
            <button
              className="m-auto p-3 bg-blue-500 text-white font-semibold"
              onClick={openDialog}
            >
              Open folder menu
            </button>
          </div>
        </div>
        :
        <>
          {
            notes.length === 0 ?
              <div className="m-auto flex flex-col items-center gap-y-8">
                <p>No note for now</p>
                  <button
                    className="p-2 bg-blue-500 text-white font-bold"
                    onClick={() => openNoteWindow(null)}
                  >
                    Create a note
                  </button>
              </div>
              :
              <div className="flex-1 flex flex-col gap-y-4 overflow-y-auto">
                <div className="flex flex-col gap-y-4">
                  {
                    notes
                    .map((note, key) => (
                      <div
                        className="flex flex-col justify-between h-48 p-2 bg-amber-200"
                        key={key}
                      >
                        <div className="prose prose-h1:text-xl line-clamp-4 w-full h-2/3">
                          <Markdown remarkPlugins={[remarkGfm]}>
                            {note.content}
                          </Markdown>
                        </div>

                        <div className="flex justify-around">
                          <button
                            className="bg-blue-500 text-white w-2/5 p-2"
                            onClick={() => openNoteWindow(note.name, true)}
                          >
                            <Pen />
                          </button>

                          <button
                            className="bg-red-500 text-white w-2/5 p-2"
                            onClick={() => onDelete(note.name)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            }
        </>
        }
    </div>
  )
}
