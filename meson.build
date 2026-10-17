project('notesmd',
          version: '0.1.0',
    meson_version: '>= 1.1',
  default_options: [ 'warning_level=2', 'werror=false', ],
)

i18n = import('i18n')
gnome = import('gnome')

profile = get_option('profile')

if profile == 'development'
  application_id = 'com.doucaml.notesmd.Devel'
else
  application_id = 'com.doucaml.notesmd'
endif

conf = configuration_data()
conf.set_quoted('APPLICATION_ID', application_id)

subdir('data')
subdir('notesmd')
subdir('po')

gnome.post_install(
     glib_compile_schemas: true,
    gtk_update_icon_cache: true,
  update_desktop_database: true,
)
