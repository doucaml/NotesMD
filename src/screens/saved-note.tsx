import { useParams, useSearchParams } from "react-router";
import NoteCard from "../components/NoteCard";
import { BaseDirectory, readTextFile } from "@tauri-apps/plugin-fs";
import { useEffect } from "react";
import { useNote } from "../contexts/NoteContext";
import { NOTES_DIR } from "./home";


export default function SavedNote() {
  const uid = useParams().uid
  const [additionalParams] = useSearchParams()
  const mode = additionalParams.get("mode")

  const { setContent } = useNote()

  useEffect(() => {
    const filePath = NOTES_DIR + uid + ".md"

    const getContent = async () => {
      const text = await readTextFile(filePath, { baseDir: BaseDirectory.AppData })
      setContent(text)
    }

    getContent()
  }, [uid])

  return <NoteCard initialMode={mode === "editor" ? "editor" : "preview"} />
}
