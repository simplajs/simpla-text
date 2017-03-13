module.exports = {
  command(...args) {
    this.execute(function(selector, property, value) {
      var element = document.querySelector(selector);
      element[property] = value;
    }, [ ...args ]);
  }
}
