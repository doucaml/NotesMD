from gi.repository import Adw, GLib, Gio, Gtk
from datetime import datetime

@Gtk.Template(resource_path="/com/doucaml/notesmd/ui/note-window.ui")
class NoteWindow(Adw.ApplicationWindow):
    __gtype_name__ = "NoteWindow"

    main_text_view: Gtk.TextView = Gtk.Template.Child()
    toast_overlay = Gtk.Template.Child()

    def __init__(self, note_path = None, **kwargs):
        super().__init__(**kwargs)

        self.note_path = note_path
        self.set_text_view_content()

        self.settings = Gio.Settings(schema_id="com.doucaml.notesmd")
        self.connect("close_request", self.on_win_close)

    def set_text_view_content(self):
        if not self.note_path:
            return

        text = Gio.File.new_for_path(self.note_path).load_contents()[1].decode()
        self.main_text_view.get_buffer().set_text(text)

    def on_win_close(self, *args):
        buffer = self.main_text_view.get_buffer()
        start_iter, end_iter = buffer.get_start_iter(), buffer.get_end_iter()
        text = buffer.get_text(start_iter, end_iter, True)

        if len(text) <= 0:
            return

        bytes = text.encode("utf-8")

        if self.note_path:
            file = Gio.File.new_for_path(self.note_path)
            file.replace_contents(bytes, None, False, Gio.FileCreateFlags.NONE)

        else:
            notes_folder = self.settings.get_string("notes-folder")
            filename = datetime.now().isoformat().replace(":", "-").replace(".", "") + ".md"
            file = Gio.File.new_for_path(f"{notes_folder}/{filename}")

            out_stream = file.create(Gio.FileCreateFlags.NONE)
            glib_bytes = GLib.Bytes.new(bytes)
            out_stream.write_bytes(glib_bytes)
