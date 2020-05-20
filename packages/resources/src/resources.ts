
export default {
// urlParams is null when used for embedding
  urlParams: {},
  // Public global variables
  MAX_REQUEST_SIZE: 10485760,
  MAX_AREA:  15000 * 15000,

  // URLs for save and export
  EXPORT_URL: '/export',
  SAVE_URL: '/save',
  OPEN_URL: '/open',
  RESOURCES_PATH: 'resources',
  RESOURCE_BASE: '/grapheditor',
  STENCIL_PATH: 'stencils',
  IMAGE_PATH: 'images',
  STYLE_PATH: 'styles',
  CSS_PATH: 'styles',
  OPEN_FORM: 'open.html',

  // Sets the base path, the UI language via URL param and configures the
  // supported languages to avoid 404s. The loading of all core language
  // resources is disabled as all required resources are in grapheditor.
  // properties. Note that in this example the loading of two resource
  // files (the special bundle and the default bundle) is disabled to
  // save a GET request. This requires that all resources be present in
  // each properties file since only one file is loaded.
  mxBasePath: '../../../src',
  mxLanguage: 'en',
  mxLanguages: ['en']
}


