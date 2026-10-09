from gi.repository import Adw, Gio, GLib, Gtk

from .note_window import NoteWindow
from .note_preview import NotePreview

@Gtk.Template(resource_path="/com/doucaml/notesmd/ui/main-window.ui")
class MainWindow(Adw.ApplicationWindow):
    __gtype_name__ = "MainWindow"

    previews_container = Gtk.Template.Child()

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        self.app = kwargs.get("application")

        self.settings = Gio.Settings(schema_id="com.doucaml.notesmd")
        self.settings.bind(
            "main-window-width", self, "default-width", Gio.SettingsBindFlags.DEFAULT
        )
        self.settings.bind(
            "main-window-height", self, "default-height", Gio.SettingsBindFlags.DEFAULT
        )
        self.settings.bind(
            "main-window-maximized", self, "maximized", Gio.SettingsBindFlags.DEFAULT
        )

        self.create_action("notes-folder", self.on_change_notes_folder)
        self.create_action("new-note", self.on_create_new_note)

        self.file_monitor = self.get_notes_folder_monitor()
        self.file_monitor.connect("changed", self.on_dir_change)

        self.add_notes_previews()

    def on_create_new_note(self, action, _):
        win = NoteWindow(application=self.app)
        win.present()

    def on_change_notes_folder(self, action, parameter):
        dialog = Gtk.FileDialog()

        current_path = self.settings.get_string("notes-folder")
        home_path = GLib.get_home_dir()
        used_path = current_path if len(current_path) > 0 else home_path

        initial_folder = Gio.File.new_for_path(used_path)
        dialog.set_initial_folder(initial_folder)

        dialog.select_folder(self, None, self.on_change_response)

    def on_change_response(self, dialog: Gtk.FileDialog, result):
        folder_path = dialog.select_folder_finish(result).get_path()

        if folder_path is not None:
            self.settings.set_string("notes-folder", folder_path)

    def on_dir_change(self, *args):
        event_type = args[3]

        print(event_type)

        used_event_types_set = (
            Gio.FileMonitorEvent.CHANGED,
            Gio.FileMonitorEvent.DELETED
        )

        if event_type in used_event_types_set:
            self.update_preview_container()

    def create_action(self, name, callback):
        action = Gio.SimpleAction(name=name)
        action.connect("activate", callback)
        self.add_action(action)

    def get_notes_dir(self):
        notes_folder_path = self.settings.get_string("notes-folder")
        notes_folder = Gio.File.new_for_path(notes_folder_path)

        return [notes_folder, notes_folder_path]

    def get_notes_folder_monitor(self):
        notes_folder, _ = self.get_notes_dir()
        file_monitor = notes_folder.monitor_directory(Gio.FileMonitorFlags.WATCH_MOVES)

        return file_monitor

    def get_notes_paths(self):
        notes_folder, notes_folder_path = self.get_notes_dir()

        notes_folder_children = notes_folder.enumerate_children(
            "standard::name, standard::type",
            Gio.FileQueryInfoFlags.NONE
        )

        children = []

        while child := notes_folder_children.next_file():
            if child.get_file_type() is Gio.FileType.REGULAR:
                child_path = f"{notes_folder_path}/{child.get_name()}"
                children.append(child_path)

        return children

    def add_notes_previews(self):
        notes_paths = self.get_notes_paths()

        for file in notes_paths:
            note_preview = NotePreview(file)
            self.previews_container.append(note_preview)

    def update_preview_container(self):
        while child := self.previews_container.get_first_child():
            self.previews_container.remove(child)

        self.add_notes_previews()
