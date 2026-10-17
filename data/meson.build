datadir = get_option('datadir')
pkgdatadir = get_option('prefix') / get_option('datadir') / meson.project_name()

blueprints = custom_target('blueprints',
  input: files(
    'ui/main-window.blp',
    'ui/note-window.blp',
    'ui/shortcuts-dialog.blp',
    'ui/note-preview.blp',
  ),
  output: '.',
  command: [
    find_program('blueprint-compiler'),
    'batch-compile',
    '--minify',
    '@OUTPUT@',
    '@CURRENT_SOURCE_DIR@',
    '@INPUT@'
  ],
)

gnome.compile_resources('notesmd',
  'notesmd.gresource.xml',
  gresource_bundle: true,
  install: true,
  install_dir: pkgdatadir,
  dependencies: blueprints,
)

desktop_conf = configuration_data()
desktop_conf.set('icon', application_id)
desktop_file = i18n.merge_file(
         input: configure_file(
         input: 'com.doucaml.notesmd.desktop.in.in',
        output: 'com.doucaml.notesmd.desktop.in',
        configuration: desktop_conf
      ),
       output: '@0@.desktop'.format(application_id),
         type: 'desktop',
       po_dir: '../po',
      install: true,
  install_dir: datadir / 'applications'
)

desktop_utils = find_program('desktop-file-validate', required: false)
if desktop_utils.found()
  test('Validate desktop file', desktop_utils, args: [desktop_file])
endif

metainfo_conf = configuration_data()
metainfo_conf.set('appid', application_id)
appstream_file = i18n.merge_file(
        input: configure_file(
         input: files('com.doucaml.notesmd.metainfo.xml.in.in'),
        output: 'com.doucaml.notesmd.metainfo.xml.in',
        configuration: metainfo_conf
      ),
       output: '@0@.metainfo.xml'.format(application_id),
       po_dir: '../po',
      install: true,
  install_dir: datadir / 'metainfo'
)

appstreamcli = find_program('appstreamcli', required: false, disabler: true)
test(
  'Validate appstream file',
  appstreamcli,
  args: ['validate', '--no-net', '--explain', appstream_file]
)

install_data(
  'com.doucaml.notesmd.gschema.xml',
  install_dir: datadir / 'glib-2.0' / 'schemas',
  rename: '@0@.gschema.xml'.format(application_id)
)

compile_schemas = find_program('glib-compile-schemas', required: false, disabler: true)
test(
  'Validate schema file',
  compile_schemas,
  args: ['--strict', '--dry-run', meson.current_source_dir()]
)


service_conf = configuration_data()
service_conf.set('appid', application_id)
service_conf.set('bindir', get_option('prefix') / get_option('bindir'))
configure_file(
  input: 'com.doucaml.notesmd.service.in',
  output: '@0@.service'.format(application_id),
  configuration: service_conf,
  install_dir: datadir / 'dbus-1' / 'services'
)

subdir('icons')
