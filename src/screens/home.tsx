import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { Plus } from "lucide-react";

const createNewNote = async () => {
  const NEW_NOTE_WEBVIEW_LABEL = "new-note";
  const newNoteWebView = await WebviewWindow.getByLabel(NEW_NOTE_WEBVIEW_LABEL);

  if (newNoteWebView !== null)
    newNoteWebView.setFocus()
  else
    new WebviewWindow(
      NEW_NOTE_WEBVIEW_LABEL,
      {
        url: "http://localhost:1420/notes/new",
        decorations: false,
        width: 500,
        height: 500
      }
    );
}

export default function Home() {
  return (
    <div className="h-full flex flex-col overflow-hidden bg-amber-200">
      <button
        className="p-2 w-fit ml-auto bg-blue-600 rounded-xl text-white"
        onClick={createNewNote}
      >
        <Plus />
      </button>

      <div className="flex-1 overflow-y-auto">
        <h1>Un test</h1>
      </div>
    </div>
  )
}
