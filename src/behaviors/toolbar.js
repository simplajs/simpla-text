export default {
  listeners: {
    'select': '_updateToolbarFromSelect',
    'command-changed': '_updateCommands',
    'blur': '_hideToolbar'
  },

  _hideToolbar() {
    this.$.toolbar.hidden = true;
  },

  _handleToolbarCommand(event) {
    let { name, options = {} } = event.detail;

    this.runCommand(name, options);
  },

  _updateToolbarFromSelect(event) {
    let { selection } = event.detail;

    if (this.plaintext) {
      this.$.toolbar.hidden = true;
      return;
    }

    this.$.toolbar.hidden = !selection;
    this.$.toolbar.hoverOverSelection(selection);
  },

  _updateCommands(event) {
    let { name, applied, meta } = event.detail,
        toolbar = this.$.toolbar;

    toolbar.set(`tools.${name}.active`, applied);
    toolbar.set(`tools.${name}.meta`, meta);
  }
}
