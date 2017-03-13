const EDITOR_COMPONENT = 'simpla-text-editor.html';

export default {
  observers: [
    '_checkEditorPrepped(editable)',
    '_updateEditorWithProps(editable, inline, plaintext)'
  ],

  getEditor() {
    return Promise.resolve(this._editor || this._createEditor())
      .then((editor) => {
        this._editor = editor;
        return editor;
      });
  },

  editorReady() {
    return !!this._editor;
  },

  runCommand(commandName) {
    return this.getEditor()
      .then(editor => {
        return editor.runCommand(commandName);
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
    } else if (this.editorReady()) {
      // Forces prosemirror to reload the state, thereby doing a check
      //  to see if it's editable
      this.getEditor()
        .then(editor => {
          editor.refresh();
        });
    }
  },

  _updateEditorWithProps(editable, inline, plaintext) {
    if (this.editable) {
      this.getEditor()
        .then(editor => {
          Object.assign(editor, { plaintext, inline, editable });
        });
    }
  }
}
