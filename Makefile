run-flatpak-devel:
	flatpak-builder --user \
    --install \
    --force-clean \
    builddir-flatpak-devel \
    com.doucaml.notesmd.Devel.json
	flatpak run com.doucaml.notesmd.Devel

run-flatpak-prod:
	flatpak-builder --user \
    --install \
    --force-clean \
    builddir-flatpak \
    com.doucaml.notesmd.json
	flatpak run com.doucaml.notesmd
run:
	meson setup builddir
	meson compile -C builddir
	/usr/bin/python3 ./builddir/src/notesmd

run-meson:
	meson setup builddir
	meson compile -C builddir
	meson install -C builddir
	/usr/bin/python3 ./builddir/src/notesmd
