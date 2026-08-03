import React from "react";
import ReactDOM from "react-dom/client";
import MainWindow from "./window-templates/MainWindow";
import { BrowserRouter, Route, Routes } from "react-router";
import NoteWindow from "./window-templates/NoteWindow";
import Home from "./screens/home";
import NewNote from "./screens/new-note";
import SavedNote from "./screens/saved-note";
import { NoteProvider } from "./contexts/NoteContext";


ReactDOM
  .createRoot(document.getElementById("root") as HTMLElement)
  .render(
    <React.StrictMode>
      <NoteProvider>
        <BrowserRouter>
          <Routes>
              <Route path="/" element={ <MainWindow /> }>
                <Route index element={ <Home /> }/>
              </Route>

              <Route path="notes" element={<NoteWindow />}>
                <Route path="new" element={<NewNote />} />
                <Route path=":uid" element={<SavedNote />} />
              </Route>
          </Routes>
        </BrowserRouter>
      </NoteProvider>
    </React.StrictMode>
);
