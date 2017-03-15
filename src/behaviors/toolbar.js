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
    let { name, applied } = event.detail,
        toolbar = this.$.toolbar;

    if (applied) {
      toolbar.activeTools = [ ...toolbar.activeTools, name ];
    } else {
      toolbar.activeTools = toolbar.activeTools.filter(tool => tool !== name);
    }
  }
}
