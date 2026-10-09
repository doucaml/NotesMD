from gi.repository import Gtk, Gio

from .note_window import NoteWindow

@Gtk.Template(resource_path="/com/doucaml/notesmd/ui/note-preview.ui")
class NotePreview(Gtk.Box):
    __gtype_name__ ="NotePreview"

    preview_label = Gtk.Template.Child()
    delete_note_btn = Gtk.Template.Child()
    open_note_btn = Gtk.Template.Child()

    def __init__(self, note_path, **kwargs):
        super().__init__(**kwargs)

        self.note_path = note_path
        self.app = kwargs.get("application")

        self.load_text(note_path)

    def load_text(self, note_path):
        file = Gio.File.new_for_path(note_path)
        contents = file.load_contents()
        text = contents[1].decode()
        self.preview_label.set_label(text)

    @Gtk.Template.Callback()
    def on_open_note(self, *args):
        win = NoteWindow(note_path=self.note_path)
        win.present()

    @Gtk.Template.Callback()
    def on_delete_note(self, *args):
        file = Gio.File.new_for_path(self.note_path)
        file.delete()
