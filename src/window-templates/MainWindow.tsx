import { Outlet} from "react-router";
import { WindowButton } from "../components/WindowButton";
import { Minus, X } from "lucide-react";
import { closeWindow, minimizeWindow } from "../utils/window-tab-helper";


export default function MainWindow() {
  return (
    <>
      <header className="bg-gray-200 h-8 flex-none flex select-none">
        <div className="w-full" data-tauri-drag-region></div>

        <div className="flex justify-around w-24 h-full">
          <WindowButton Icon={Minus} onClick={minimizeWindow} />
          <WindowButton Icon={X} onClick={closeWindow} />
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-1">
        <Outlet />
      </main>
    </>
  );
}
