import { Outlet } from "react-router";
import { WindowButton } from "../components/WindowButton";
import { Minus, X } from "lucide-react";
import { closeWindow, minimizeWindow } from "../utils/window-tab-helper";


export default function NoteWindow() {
  return (
    <div className="h-full flex flex-col">
      <header className="h-8 flex-none flex select-none">
        <div className="bg-amber-500 w-full" data-tauri-drag-region />

        <div className="flex justify-around w-12 h-full bg-blue-200">
          <WindowButton Icon={Minus} onClick={minimizeWindow} />
          <WindowButton Icon={X} onClick={closeWindow} />
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-1">
        <Outlet />
      </main>
    </div>
  )
}
