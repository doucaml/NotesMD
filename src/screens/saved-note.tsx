import { useParams } from "react-router";
import NoteCard from "../components/NoteCard";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { DIR_PATH_KEY } from "./home";
import { useEffect } from "react";
import { useNote } from "../contexts/NoteContext";



export default function SavedNote() {
  const uid = useParams().uid
  const { setContent } = useNote()

  useEffect(() => {
    const getContent = async (uid: string) => {
      const filename = `${localStorage.getItem(DIR_PATH_KEY)!}/${uid}.md`

      const text = await readTextFile(filename)
      setContent(text)
    }

    getContent(uid!)
  }, [])

  // const content = await getContent()

  return <NoteCard title="" />
}
