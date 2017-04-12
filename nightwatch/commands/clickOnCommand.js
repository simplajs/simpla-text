module.exports = {
  command(selector, name) {
    this
      .hoverOverCommand(name)
      .mouseButtonClick();
  }
}
