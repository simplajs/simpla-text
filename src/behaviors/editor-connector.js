const EDITOR_COMPONENT = 'simpla-text-editor.html';

export default {
  properties: {
    commands: {
      type: Array,
      computed: '_computeCommands(plaintext)'
    }
  },

  observers: [
    '_checkEditorPrepped(editable, commands, inline)'
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
      .then(() => {
        const Editor = window.SimplaText.Editor,
              toFormatter = (command) => Editor.formatters[command];

        return new Editor({
          dom: this,
          inline: this.inline,
          formatters: this.commands.map(toFormatter),
          formatterChangedCallback: (formatter, state) => {
            this.fire('command-changed', {
              name: formatter.name,
              applied: state.applied,
              meta: state.meta
            });
          },
          selectCallback: (selection) => this.fire('select', { selection }),
          inputCallback: () => this.fire('input'),
          editableCallback: () => this.editable
        });
      });
    }

    return this.__waitForEditor;
  },

  _checkEditorPrepped(editable) {
    if (editable) {
      this.getEditor();
    }
  },

  _computeCommands(plaintext) {
    return plaintext ? [] : [ 'bold', 'italic', 'underline' ];
  }
}
