export default {
  listeners: {
    'select': '_updateToolbarPosition',
    'blur': '_hideToolbar'
  },

  _hideToolbar() {
    this.$.toolbar.hidden = true;
  },

  _handleToolbarCommand(event) {
    let { name, config = {} } = event.detail;

    this.runCommand(name, config);
  },

  _updateToolbarPosition(event) {
    let toolbar = this.$.toolbar,
        host = toolbar.parentElement,
        selection = event.detail.selection,
        toolbarBounds,
        rangeBounds,
        hostBounds,
        left,
        top;

    toolbar.hidden = !selection;

    if (!selection) {
      return;
    }

    rangeBounds = selection.getRangeAt(0).getBoundingClientRect();
    hostBounds = host.getBoundingClientRect();
    toolbarBounds = toolbar.getBoundingClientRect();

    left = rangeBounds.left - hostBounds.left + (rangeBounds.width - toolbarBounds.width) / 2;
    top = rangeBounds.top - hostBounds.top - toolbarBounds.height;

    Object.assign(toolbar.style, {
      left: `${left}px`,
      top: `${top}px`
    });
  }
}
