run:
	meson setup builddir
	meson compile -C builddir
	/usr/bin/python3 ./builddir/src/notesmd

run-install:
	meson setup builddir
	meson compile -C builddir
	meson install -C builddir
	/usr/bin/python3 ./builddir/src/notesmd
