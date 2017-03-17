const TOOLBAR_TAG = 'simpla-text-toolbar';

module.exports = {
  command(name) {
    this.execute(function(selector, name) {
      var toolbar = document.querySelector(selector),
          command = toolbar.$$('[data-command="' + name + '"]'),
          toolbarBounds,
          commandBounds;

      commandBounds = command.getBoundingClientRect();
      toolbarBounds = toolbar.getBoundingClientRect();

      return {
        offsetLeft: commandBounds.left - toolbarBounds.left,
        offsetTop: commandBounds.top - toolbarBounds.top,
        width: commandBounds.width,
        height: commandBounds.height
      }
    }, [ TOOLBAR_TAG, name ], function(response) {
      let { offsetLeft, offsetTop, width, height } = response.value;
      this.moveToElement(TOOLBAR_TAG, offsetLeft + width / 2, offsetTop + height / 2);
    });
  }
}
