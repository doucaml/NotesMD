import { homeDir } from "@tauri-apps/api/path";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { open } from '@tauri-apps/plugin-dialog';
import { readDir, watchImmediate } from "@tauri-apps/plugin-fs";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";


export const DIR_PATH_KEY = "NOTES_DIR_PATH"

const openNoteWindow = async (uid: string | null) => {
  let windowLabel
  let url = "http://localhost:1420/notes/"

  const windowOptions = {
    decorations: false,
    width: 500,
    height: 500
  }

  if (uid) {
    windowLabel = uid;
    url += uid
  }

  else {
    windowLabel = "new-note"
    url += "new"
  }

  const noteWebView = await WebviewWindow.getByLabel(windowLabel);

  if (noteWebView !== null)
    noteWebView.setFocus()

  else
    new WebviewWindow(
      windowLabel,
      { url: url, ...windowOptions }
    );
}

const openDialog = async () => {
  const homeDirPath = await homeDir()
  const filePath = await open({
    multiple: false,
    directory: true,
    defaultPath: homeDirPath
  })

  if (filePath)
    localStorage.setItem(DIR_PATH_KEY, filePath)
}

export default function Home() {
  const isDirPicked = localStorage.getItem(DIR_PATH_KEY) !== null
  const dirPath = localStorage.getItem(DIR_PATH_KEY)!

  const [notes, setNotes] = useState<string[]>([])

  const getNotes = async () => {
    const entries = await readDir(dirPath)

    setNotes(
      entries
      .filter(entry => entry.isFile)
      .map(filename => filename.name.slice(0, -3))
    )
  }

  useEffect(() => {
    getNotes()
    console.log("initial trigger")
  }, [])

  useEffect(() => {
    const watchChange = async () => {
      await watchImmediate(
        dirPath,
        () => {
          getNotes()
          console.log("triggered")
        }
      )
    }

    watchChange()
  }, [])

  return (
    <div className="h-full flex flex-col overflow-hidden" >
      {
        !isDirPicked ?
        <div className="flex-1 flex overflow-y-auto">
          <div className="flex m-auto flex-col gap-y-4">
            <h1 className="">Choose a folder where your notes will be saved</h1>
            <button
              className="m-auto p-3 rounded-xl bg-blue-500 text-white font-semibold"
              onClick={openDialog}
            >
              Open folder menu
            </button>
          </div>
        </div>
          :
        <div className="flex-1 flex flex-col gap-y-4 overflow-y-auto">
          < button
            className="p-2 w-fit ml-auto bg-blue-600 rounded-xl text-white"
            onClick={() => openNoteWindow(null)}
          >
            <Plus />
          </button >

            <div className="flex flex-col gap-y-4">
            {
              notes
                .map((note, key) => (
                  <div
                    className="flex flex-col gap-y-4 p-3 bg-amber-200 rounded-2xl"
                    key={key}
                  >
                    <p>{note}</p>

                    <button
                      className="bg-blue-500 text-white p-2 rounded-xl"
                      onClick={() => openNoteWindow(note)}
                    >open</button>
                  </div>
                )
              )
            }
          </div>
        </div>
      }
    </div>
  )
}
