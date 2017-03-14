const containsTag = require('./containsTag');

exports.assertion = function(...args) {
  this.DEFAULT_MSG = this.DEFAULT_MSG || 'Testing if innerHTML of <%s> does not contain "%s" tag.';
  containsTag.assertion.call(this, ...args);
  this.expected = false;
};
