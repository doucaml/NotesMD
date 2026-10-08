from gi.repository import Adw, GLib, Gio, Gtk
from datetime import datetime

@Gtk.Template(resource_path="/com/doucaml/notesmd/ui/note-window.ui")
class NoteWindow(Adw.ApplicationWindow):
    __gtype_name__ = "NoteWindow"

    main_text_view: Gtk.TextView = Gtk.Template.Child()
    cursor_pos = Gtk.Template.Child()
    toast_overlay = Gtk.Template.Child()

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        buffer = self.main_text_view.get_buffer()
        buffer.connect("notify::cursor-position", self.update_cursor_position)

        self.settings = Gio.Settings(schema_id="com.doucaml.notesmd")
        self.connect("close_request", self.on_win_close)

    def update_cursor_position(self, buffer, _):
        cursor_pos = buffer.props.cursor_position

        iter = buffer.get_iter_at_offset(cursor_pos)
        line = iter.get_line() + 1
        column = iter.get_line_offset() + 1

        self.cursor_pos.set_text(f"Ln {line}, Col {column}")

    def on_win_close(self, *args):
        notes_folder = self.settings.get_string("notes-folder")

        filename = datetime.now().isoformat().replace(":", "-").replace(".", "") + ".md"
        file = Gio.File.new_for_path(f"{notes_folder}/{filename}")

        buffer = self.main_text_view.get_buffer()
        start_iter, end_iter = buffer.get_start_iter(), buffer.get_end_iter()

        text = buffer.get_text(start_iter, end_iter, True)

        if len(text) > 0:
            bytes = GLib.Bytes.new(text.encode("utf-8"))

            out_stream = file.create(Gio.FileCreateFlags.NONE)
            out_stream.write_bytes(bytes)
