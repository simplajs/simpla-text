module.exports = {
  command() {
    this
      .moveCursor('right')
      .highlight(1, 'word', 'left');
  }
}
