import { BookOpen, Pen } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useNote } from "../contexts/NoteContext";


export default function NoteCard({ title }: { title: string }) {
  const { content, setContent } = useNote()

  const [titleText, setTitleText] = useState(title)
  const [mode, setMode] = useState<"editor" | "preview">(
    content.length === 0 ? "editor" : "preview"
  )

  const toggleMode = () => {
    if (mode === "editor")
      setMode("preview")

    else
      setMode("editor")
  }

  return (
    <div className="flex flex-col h-full gap-y-4 p-1 bg-amber-100 overflow-hidden">
      <div className="flex flex-row justify-between items-center">
        <input
          className="w-full font-bold text-xl focus:outline-none focus:ring-0"
          placeholder="No title"
          value={titleText}
          onInput={(e) => setTitleText(e.currentTarget.value)}
        />

        <button
          onClick={toggleMode}
          className="p-2 rounded-md bg-blue-500 text-white"
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
