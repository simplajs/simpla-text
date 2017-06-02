const util = require('util');

/**
 * Checks if  given element's innerText matches given text
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.innerText("simpla-text", "Hello World");
 *    };
 * ```
 */

exports.assertion = function(selector, text, msg, { trim = true } = {}) {
  this.DEFAULT_MSG = this.DEFAULT_MSG || 'Testing if innerText of <%s> equals "%s".';

  this.message = msg || util.format(this.DEFAULT_MSG, selector, text);

  this.expected = text;
  this.value = () => this.result;

  this.pass = () => text === this.result;

  this.command = function(callback) {
    return this.api.execute(function(selector, trim) {
      var element = document.querySelector(selector),
          text = element.innerText;

      return trim ? text.trim() : text;
    }, [ selector, trim ], (result) => {
      this.result = result.value;
      callback(result);
    });
  }

};
