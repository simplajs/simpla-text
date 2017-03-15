module.exports = {
  command(direction) {
    this
      .keys([ this.Keys.COMMAND, direction === 'right' ? this.Keys.RIGHT : this.Keys.LEFT ])
      .keys([ this.Keys.NULL ])
  }
}
