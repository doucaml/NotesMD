import { BookOpen, Pen } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useNote } from "../contexts/NoteContext";


type ModeType = "editor" | "preview"

export default function NoteCard({ initialMode } : { initialMode : ModeType }) {
  const { content, setContent } = useNote()

  const [mode, setMode] = useState<ModeType>(initialMode)
  const toggleMode = () => mode === "editor" ? setMode("preview") : setMode("editor")

  return (
    <div className="flex flex-col h-full gap-y-4 p-1 bg-amber-100 overflow-hidden">
      <div className="flex flex-row justify-between items-center">
        <button
          onClick={toggleMode}
          className="ml-auto p-2 rounded-md bg-blue-500 text-white"
        >
          {
            mode === "editor" ?
            <BookOpen />
              :
            <Pen />
          }
        </button>
      </div>

      <div className="flex-1 flex flex-col w-full overflow-hidden">
        {
          mode === "editor" ?
            <textarea
              value={content}
              onInput={(e) => setContent(e.currentTarget.value)}
              className="w-full flex-1 resize-none focus:outline-none focus:ring-0"
            />
            :
          <div className="flex-1 overflow-y-auto prose prose-sm prose-h1:text-2xl w-full max-w-none">
            <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
          </div>
        }
      </div>
    </div>
  )
}
