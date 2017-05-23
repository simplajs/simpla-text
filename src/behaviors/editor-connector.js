const TOOLBAR = document.createElement('simpla-text-toolbar'),
      EDITOR_DEPENDENCIES = [
        'simpla-text-toolbar.html',
        '../simpla-richtext-behavior/simpla-richtext-behavior.html'
       ],
       DEFAULT_PLUGINS = [
        'bold',
        'italic',
        'underline',
        'link'
       ];

export default {
  observers: [
    '_checkEditorPrepped(editable, inline)',
    '_updateEditorEditable(editable)'
  ],

  getEditor() {
    return this._editor;
  },

  _importEditorDeps() {
    let depImports = [];

    EDITOR_DEPENDENCIES.forEach(dep => {
      depImports.push(new Promise((resolve, reject) => {
        this.importHref(this.resolveUrl(dep), resolve, reject);
      }));
    });

    return Promise.all(depImports);
  },

  loadEditor() {
    return Promise.resolve(this._editor || this._createEditor())
      .then((editor) => {
        this._editor = editor;
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
      this.__waitForEditor = this._importEditorDeps()
        .then(() => {
          const { RichText } = window.SimplaBehaviors;

          let editor,
              updateTools,
              updateRangeAndTarget;

          editor = new RichText(this, {
            inline: this.inline,
            placeholder: this.placeholder,
            plugins: this.plaintext ? [] : DEFAULT_PLUGINS,
            editable: this.editable,
            typographer: !this.noTypographer
          });

          updateTools = ({ name, applied, meta }) => {
            if (TOOLBAR.target === editor) {
              this._tools = this._tools || {};
              this._tools[name] = { applied, meta };

              if (TOOLBAR.set) {
                TOOLBAR.set(`tools.${name}.active`, applied);
                TOOLBAR.set(`tools.${name}.meta`, meta);
              } else {
                TOOLBAR.tools = TOOLBAR.tools || {};
                TOOLBAR.tools[name] = { applied, meta };
              }
            }
          }

          updateRangeAndTarget = ({ selection }) => {
            const shouldShowToolbar = selection && this.editable && !this.plaintext;

            this.fire('select', { selection });

            if (TOOLBAR.parentElement !== document.body) {
              document.body.appendChild(TOOLBAR);
            }

            TOOLBAR.range = shouldShowToolbar && selection.rangeCount && selection.getRangeAt(0);

            if (this._tools) {
              TOOLBAR.tools = this._tools;
            }

            // We're only setting the target on the toolbar editor if selection
            //  is truthy, as we want the toolbar to still have a reference to it
            //  even if this loses focus e.g. toolbar receiving input for link href
            if (selection) {
              TOOLBAR.target = editor;
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
  }
}
