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
    <div className="flex flex-col h-full gap-y-4 p-1 overflow-hidden">
      <div className="flex flex-row justify-between items-center">
        <button
          onClick={toggleMode}
          className="ml-auto p-2 cursor-pointer rounded-md hover:bg-gray-50"
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
              className="w-full flex-1 antialiased resize-none focus:outline-none focus:ring-0"
            />
            :
            <div
              className="flex-1 overflow-y-auto prose prose-sm prose-h1:text-[21px] prose-li:marker:text-black w-full max-w-none"
            >
              <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
          </div>
        }
      </div>
    </div>
  )
}
