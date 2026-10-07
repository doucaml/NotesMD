from gi.repository import Adw, Gio, GLib, Gtk

from .note_window import NoteWindow

@Gtk.Template(resource_path="/com/doucaml/notesmd/ui/main-window.ui")
class MainWindow(Adw.ApplicationWindow):
    __gtype_name__ = "MainWindow"

    new_note_btn = Gtk.Template.Child()
    toast_overlay = Gtk.Template.Child()

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        self.settings = Gio.Settings(schema_id="com.doucaml.notesmd")
        self.settings.bind(
            "window-width", self, "default-width", Gio.SettingsBindFlags.DEFAULT
        )
        self.settings.bind(
            "window-height", self, "default-height", Gio.SettingsBindFlags.DEFAULT
        )
        self.settings.bind(
            "window-maximized", self, "maximized", Gio.SettingsBindFlags.DEFAULT
        )

        self.create_action("notes-folder", self.on_change_notes_folder)
        self.create_action("new-note", self.on_create_new_note)

    def create_action(self, name, callback):
        action = Gio.SimpleAction(name=name)
        action.connect("activate", callback)
        self.add_action(action)

    def on_create_new_note(self, action, _):
        win = NoteWindow(application=self.get_application())
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
