const EDITOR_COMPONENT = 'simpla-text-editor.html';

export default {
  observers: [
    '_checkEditorPrepped(editable, plaintext, inline)'
  ],

  getEditor() {
    return Promise.resolve(this._editor || this._createEditor())
      .then((editor) => {
        this._editor = editor;
        return editor;
      });
  },

  runCommand(commandName, options = {}) {
    return this.getEditor()
      .then(editor => {
        return editor.runCommand(commandName, options);
      });
  },

  _createEditor() {
    if (!this.__waitForEditor) {
      this.__waitForEditor = new Promise((resolve, reject) => {
        let editorUrl = this.resolveUrl(EDITOR_COMPONENT);
        this.importHref(editorUrl, resolve, reject);
      })
      .then(() => window.SimplaText.Editor.fromElement(this));
    }

    return this.__waitForEditor;
  },

  _checkEditorPrepped(editable) {
    if (editable) {
      this.getEditor();
    }
  }
}
