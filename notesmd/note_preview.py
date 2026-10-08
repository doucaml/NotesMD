from gi.repository import Gtk


@Gtk.Template(resource_path="/com/doucaml/notesmd/ui/note-preview.ui")
class NotePreview(Gtk.Box):
    __gtype_name__ ="NotePreview"

    def __init(self, **kwargs):
        super().__init__(**kwargs)
