import { getCurrentWindow } from "@tauri-apps/api/window"

export const closeWindow = async () =>
  await getCurrentWindow().close()

export const minimizeWindow = async () =>
  await getCurrentWindow().minimize()

export const toggleWindowSize = async () =>
  await getCurrentWindow().toggleMaximize()
