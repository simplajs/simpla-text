const EDITOR_COMPONENT = 'simpla-text-editor.html';
const toolbar = document.createElement('simpla-text-toolbar');
const EDITOR_PROP = '_editor';

export default {
  properties: {

    plugins: {
      type: Array,
      computed: '_computePlugins(plaintext)'
    }

  },

  observers: [
    '_checkEditorPrepped(editable, plugins, inline)',
    '_updateEditorEditable(editable)'
  ],

  getEditor() {
    return this[EDITOR_PROP];
  },

  loadEditor() {
    return Promise.resolve(this[EDITOR_PROP] || this._createEditor())
      .then((editor) => {
        this[EDITOR_PROP] = editor;
        return editor;
      });
  },

  runCommand(commandName, options = {}) {
    return this.loadEditor()
      .then(editor => {
        return editor.format(commandName, options);
      });
  },

  _createEditor() {
    if (!this.__waitForEditor) {
      this.__waitForEditor = new Promise((resolve, reject) => {
        let editorUrl = this.resolveUrl(EDITOR_COMPONENT);
        this.importHref(editorUrl, resolve, reject);
      })
      .then(() => {
        const { RichText } = window.SimplaBehaviors;

        let editor,
            updateTools,
            updateRangeAndTarget;

        editor = new RichText(this, {
          inline: this.inline,
          placeholder: this.placeholder,
          plugins: this.plugins,
          editable: this.editable,
          typeographer: !this.noTypeographer
        });

        updateTools = ({ name, applied, meta }) => {
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
        }

        updateRangeAndTarget = ({ selection }) => {
          const shouldShowToolbar = selection && this.editable && !this.plaintext;

          this.fire('select', { selection });

          if (toolbar.parentElement !== document.body) {
            document.body.appendChild(toolbar);
          }

          toolbar.range = shouldShowToolbar && selection.rangeCount && selection.getRangeAt(0);

          if (this._tools) {
            toolbar.tools = this._tools;
          }

          // We're only setting the target on the toolbar editor if selection
          //  is truthy, as we want the toolbar to still have a reference to it
          //  even if this loses focus e.g. toolbar receiving input for link href
          if (selection) {
            toolbar.target = editor;
          }
        };

        editor.on('plugin', updateTools);
        editor.on('select', updateRangeAndTarget);
        editor.on('input', () => this.fire('input'));

        return editor;
      });
    }

    return this.__waitForEditor;
  },

  _updateEditorEditable(editable) {
    let editor = this.getEditor();

    if (editor) {
      editor.editable = editable;
    }
  },

  _checkEditorPrepped(editable) {
    if (editable) {
      this.loadEditor();
    }
  },

  _computePlugins(plaintext) {
    return plaintext ? [] : [ 'bold', 'italic', 'underline', 'link' ];
  }
}
