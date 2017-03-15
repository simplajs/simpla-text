export default {
  listeners: {
    'select': '_updateToolbarFromSelect',
    'formatter-updated': '_handleFormatterUpdated',
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

  _handleFormatterUpdated(event) {
    let { name, state } = event.detail,
        toolbar = this.$.toolbar;

    if (state.applied) {
      toolbar.activeTools = [ ...toolbar.activeTools, name ];
    } else {
      toolbar.activeTools = toolbar.activeTools.filter(tool => tool !== name);
    }
  }
}
