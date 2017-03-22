const EDITOR_COMPONENT = 'simpla-text-editor.html';
const toolbar = document.createElement('simpla-text-toolbar');

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
        const { Editor, formatters } = window.SimplaText,
              toFormatter = (command) => formatters[command];

        return new Editor({
          dom: this,
          inline: this.inline,
          formatters: this.commands.map(toFormatter),
          placeholder: this.placeholder,
          formatterChangedCallback: ({ name }, { applied, meta }) => {
            this
              .getEditor()
              .then(editor => {
                if (toolbar.target === editor) {
                  this._tools = this._tools || {};
                  this._tools[name] = { applied, meta };

                  if (toolbar.set) {
                    toolbar.set(`tools.${name}.active`, applied);
                    toolbar.set(`tools.${name}.meta`, meta);
                  } else {
                    toolbar.tools = toolbar.tools || {};
                    toolbar.tools[name] = { applied, meta };
                  }
                }
              });
          },
          selectCallback: (selection) => {
            this.fire('select', { selection });

            if (toolbar.parentElement !== document.body) {
              document.body.appendChild(toolbar);
            }

            toolbar.range = selection && selection.rangeCount && selection.getRangeAt(0);

            if (this._tools) {
              toolbar.tools = this._tools;
            }

            // We're only setting the target on the toolbar editor if selection
            //  is truthy, as we want the toolbar to still have a reference to it
            //  even if this loses focus e.g. toolbar receiving input for link href
            if (selection) {
              this
                .getEditor()
                .then(editor => {
                  toolbar.target = editor;
                });
            }
          },
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
    return plaintext ? [] : [ 'bold', 'italic', 'underline', 'link' ];
  }
}
