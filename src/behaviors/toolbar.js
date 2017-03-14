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

    this.$.toolbar.hoverOverSelection(selection);
    this.$.toolbar.filterActiveControls(commandName => {
      return this.runCommand(commandName, { dry: true })
        .then(willChangeState => !willChangeState);
    });
  }
}
