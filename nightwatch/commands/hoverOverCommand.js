module.exports = {
  command(selector, name) {
    this.execute(function(selector, name) {
      var text = document.querySelector(selector),
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
    }, [ selector, name ], function(response) {
      let { offsetLeft, offsetTop, width, height } = response.value;
      this.moveToElement(selector, offsetLeft + width / 2, offsetTop + height / 2);
    });
  }
}
