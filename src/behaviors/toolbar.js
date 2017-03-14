export default {
  listeners: {
    'select': '_updateToolbarFromSelect',
    'blur': '_hideToolbar'
  },

  _hideToolbar() {
    this.$.toolbar.hidden = true;
  },

  _handleToolbarCommand(event) {
    let { name, config = {} } = event.detail;

    this.runCommand(name, config);
  },

  _updateToolbarFromSelect(event) {
    let { selection } = event.detail;

    if (this.plaintext) {
      this.$.toolbar.hidden = true;
      return;
    }

    this.$.toolbar.hidden = !selection;

    this.$.toolbar.hoverOverSelection(selection);
    this.$.toolbar.filterActiveTools(commandName => {
      return this.runCommand(commandName, { dry: true })
        .then(willChangeState => !willChangeState);
    });
  }
}
