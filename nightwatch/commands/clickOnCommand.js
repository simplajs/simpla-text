module.exports = {
  command(...args) {
    this
      .hoverOverCommand(...args)
      .mouseButtonClick();
  }
}
