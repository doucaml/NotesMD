# MIT License
#
# Copyright (c) 2026 Mohamed Doucouré
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.
#
# SPDX-License-Identifier: MIT

from gi.repository import Adw, Gio, GLib, Gtk


@Gtk.Template(resource_path="/com/doucaml/notesmd/ui/note-window.ui")
class NoteWindow(Adw.ApplicationWindow):
    __gtype_name__ = "NoteWindow"

    main_text_view = Gtk.Template.Child()
    cursor_pos = Gtk.Template.Child()
    toast_overlay = Gtk.Template.Child()

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        buffer = self.main_text_view.get_buffer()
        buffer.connect("notify::cursor-position", self.update_cursor_position)

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

    def close(self):
        print("The window is closed.")
        super().close()

    def open_file_dialog(self, action, _):
        native = Gtk.FileDialog()
        native.open(self, None, self.on_open_response)

    def on_open_response(self, dialog, result):
        file = dialog.open_finish(result)

        if file is not None:
            self.open_file(file)

    def open_file(self, file):
        file.load_contents_async(None, self.open_file_complete)

    def open_file_complete(self, file, result):
        info = file.query_info("standard::display-name", Gio.FileQueryInfoFlags.NONE)

        if info:
            display_name = info.get_attribute_string("standard::display-name")

        else:
            display_name = file.get_basename()

        contents = file.load_contents_finish(result)

        if not contents[0]:
            path = file.seek_path()
            self.toast_overlay.add_toast(
                Adw.Toast(title=f"Unable to open “{display_name}”")
            )
            return

        try:
            text = contents[1].decode("utf-8")

        except UnicodeError as err:
            path = file.peek_path()
            self.toast_overlay.add_toast(
                Adw.Toast(title=f"Invalid text encoding for “{display_name}”")
            )
            return

        buffer = self.main_text_view.get_buffer()
        buffer.set_text(text)
        start = buffer.get_start_iter()
        buffer.place_cursor(start)

        self.set_title(display_name)
        self.toast_overlay.add_toast(Adw.Toast(title=f"Opened “{display_name}”"))

    def update_cursor_position(self, buffer, _):
        cursor_pos = buffer.props.cursor_position

        iter = buffer.get_iter_at_offset(cursor_pos)
        line = iter.get_line() + 1
        column = iter.get_line_offset() + 1

        self.cursor_pos.set_text(f"Ln {line}, Col {column}")

    def on_save_response(self, dialog, result):
        file = dialog.save_finish(result)

        if file is not None:
            self.save_file(file)

    def save_file(self, file):
        buffer = self.main_text_view.get_buffer()

        start = buffer.get_start_iter()
        end = buffer.get_end_iter()
        text = buffer.get_text(start, end, False)

        if not text:
            return

        bytes = GLib.Bytes.new(text.encode("utf-8"))

        file.replace_contents_bytes_async(
            bytes, None, False, Gio.FileCreateFlags.NONE, None, self.save_file_complete
        )

    def save_file_complete(self, file, result):
        res = file.replace_contents_finish(result)
        info = file.query_info("standard::display-name", Gio.FileQueryInfoFlags.NONE)
        if info:
            display_name = info.get_attribute_string("standard::display-name")

        else:
            display_name = file.get_basename()

        if not res:
            msg = f"Unable to save as “{display_name}”"

        else:
            msg = f"Saved as “{display_name}”"
        self.toast_overlay.add_toast(Adw.Toast(title=msg))
