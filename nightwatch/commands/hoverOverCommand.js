module.exports = {
  command(name) {
    this.execute(function(name) {
      var text = document.querySelector('simpla-text'),
          toolbar = text.$.toolbar,
          command = toolbar.$$('[data-command="' + name + '"]'),
          textBounds,
          commandBounds;

      commandBounds = command.getBoundingClientRect();
      textBounds = text.getBoundingClientRect();

      return {
        offsetLeft: commandBounds.left - textBounds.left,
        offsetTop: commandBounds.top - textBounds.top,
        width: commandBounds.width,
        height: commandBounds.height
      }
    }, [ name ], function(response) {
      let { offsetLeft, offsetTop, width, height } = response.value;
      this.moveToElement('simpla-text', offsetLeft + width / 2, offsetTop + height / 2);
    });
  }
}
