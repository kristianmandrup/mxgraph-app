import mx from "@mxgraph-app/mx";
const { mxUtils, mxResources } = mx;
import resources from "./resources";
const { STYLE_PATH, RESOURCE_BASE, mxLanguage } = resources;

const Graph: any = {};

// Adds required resources (disables loading of fallback properties, this can only
// be used if we know that all keys are defined in the language specific file)
export class LoadResources {
  themes: any = {};

  constructor() {}

  init() {
    mxResources.loadDefaultBundle = false;
  }

  get defaultBundle() {
    return mxResources.getDefaultBundle(RESOURCE_BASE, mxLanguage);
  }

  get specialBundle() {
    return mxResources.getSpecialBundle(RESOURCE_BASE, mxLanguage);
  }

  get bundle() {
    return this.defaultBundle || this.specialBundle;
  }

  load() {
    // Fixes possible asynchronous requests
    mxUtils.getAll(
      [this.bundle, STYLE_PATH + "/default.xml"],
      (xhr) => {
        // Adds bundle text to resources
        mxResources.parse(xhr[0].getText());
        this.setThemes(xhr);
        // Configures the default graph theme
        this.createEditorUI();
      },
      () => {
        document.body.innerHTML =
          '<center style="margin-top:10%;">Error loading resource files. Please check browser console.</center>';
      }
    );
  }

  setThemes(xhr) {
    const themes = new Object();
    themes[Graph.prototype["defaultThemeName"]] = xhr[1].getDocumentElement();
    this.themes = themes;
  }

  createEditor() {
    // return new Editor(this.themes)
  }

  createEditorUI() {
    // const editor = this.createEditor();
    // Main
    // new EditorUi(editor);
  }
}
