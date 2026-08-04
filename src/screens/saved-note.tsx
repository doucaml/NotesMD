import { useParams, useSearchParams } from "react-router";
import NoteCard from "../components/NoteCard";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { DIR_PATH_KEY } from "./home";
import { useEffect, useMemo } from "react";
import { useNote } from "../contexts/NoteContext";


export default function SavedNote() {
  const dirPath = useMemo(() => localStorage.getItem(DIR_PATH_KEY), [])

  const uid = useParams().uid
  const [additionalParams] = useSearchParams()
  const mode = additionalParams.get("mode")

  const { setContent } = useNote()

  useEffect(() => {
    if (!dirPath) return

    const filename = `${dirPath}/${uid}.md`

    const getContent = async () => {
      const text = await readTextFile(filename)
      setContent(text)
    }

    getContent()
  }, [uid, dirPath])

  return <NoteCard initialMode={mode === "editor" ? "editor" : "preview"} />
}
