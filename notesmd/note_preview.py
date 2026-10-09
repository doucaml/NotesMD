from gi.repository import Gtk, Gio


@Gtk.Template(resource_path="/com/doucaml/notesmd/ui/note-preview.ui")
class NotePreview(Gtk.Box):
    __gtype_name__ ="NotePreview"

    preview_label = Gtk.Template.Child()
    delete_note_btn = Gtk.Template.Child()
    open_note_btn = Gtk.Template.Child()

    def __init__(self, note_path: Gio.File, **kwargs):
        super().__init__(**kwargs)

        self.load_text(note_path)

    def load_text(self, note_path):
        file = Gio.File.new_for_path(note_path)
        contents = file.load_contents()
        text = contents[1].decode()
        self.preview_label.set_label(text)

    @Gtk.Template.Callback()
    def on_open_note(self):
        pass

    @Gtk.Template.Callback()
    def on_delete_note(self):
        pass
