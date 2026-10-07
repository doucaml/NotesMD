import json
import sys

import gi

gi.require_version("Gtk", "4.0")
gi.require_version("Adw", "1")

from gi.repository import Adw, Gio, GLib

from .main_window import MainWindow
from .note_window import NoteWindow


class MainApplication(Adw.Application):
    def __init__(self):
        super().__init__(
            application_id="com.doucaml.notesmd",
            flags=Gio.ApplicationFlags.DEFAULT_FLAGS,
            resource_base_path="/com/doucaml/notesmd",
        )
        self.create_action("quit", lambda *_: self.quit(), ["<control>q"])
        self.create_action("about", self.on_about_action)
        self.create_action("preferences", self.on_preferences_action)
        self.create_action("new-note", self.on_create_new_note, ["<control>n"])

        self.settings = Gio.Settings(schema_id="com.doucaml.notesmd")

        dark_mode = self.settings.get_boolean("dark-mode")
        style_manager = Adw.StyleManager.get_default()

        if dark_mode:
            style_manager.set_color_scheme(Adw.ColorScheme.FORCE_DARK)
        else:
            style_manager.set_color_scheme(Adw.ColorScheme.DEFAULT)

        dark_mode_action = Gio.SimpleAction(
            name="dark-mode", state=GLib.Variant.new_boolean(False)
        )
        dark_mode_action.connect("activate", self.toggle_dark_mode)
        dark_mode_action.connect("change-state", self.change_color_scheme)
        self.add_action(dark_mode_action)

        self.set_accels_for_action("win.open", ["<Ctrl>o"])

    def do_activate(self):
        win = self.props.active_window
        if not win:
            win = MainWindow(application=self)
        win.present()

    def create_action(self, name, callback, shortcuts=None):
        action = Gio.SimpleAction(name=name)
        action.connect("activate", callback)
        self.add_action(action)

        if shortcuts:
            self.set_accels_for_action(f"app.{name}", shortcuts)

    def toggle_dark_mode(self, action, _):
        state = action.get_state()
        old_state = state.get_boolean()
        new_state = not old_state
        action.change_state(GLib.Variant.new_boolean(new_state))

    def change_color_scheme(self, action, new_state):
        dark_mode = new_state.get_boolean()
        style_manager = Adw.StyleManager.get_default()

        if dark_mode:
            style_manager.set_color_scheme(Adw.ColorScheme.FORCE_DARK)
        else:
            style_manager.set_color_scheme(Adw.ColorScheme.DEFAULT)

        action.set_state(new_state)
        self.settings.set_boolean("dark-mode", dark_mode)

    def on_create_new_note(self, action, _):
        win = NoteWindow(application=self)
        win.present()

    def on_about_action(self, *args):
        stream = Gio.resources_open_stream(
            "/com/doucaml/notesmd/metadata/app-infos.json", Gio.ResourceLookupFlags.NONE
        )
        bytes = stream.read_bytes(4096).get_data()

        if bytes is not None:
            infos = json.loads(bytes.decode("utf-8"))

            about = Adw.AboutDialog(
                application_name=infos["application_name"],
                application_icon=infos["application_icon"],
                developer_name=infos["developer_name"],
                version=infos["version"],
                developers=infos["developers"],
                copyright=infos["copyright"],
            )
            # about.set_translator_credits(_("translator-credits"))
            about.present(self.props.active_window)

    def on_preferences_action(self, widget, _):
        print("app.preferences action activated")


def main(version):
    app = MainApplication()
    return app.run(sys.argv)
