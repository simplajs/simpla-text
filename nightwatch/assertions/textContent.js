const util = require('util');

/**
 * Checks if  given element's textContent matches given text
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.textContent("simpla-text", "Hello World");
 *    };
 * ```
 */

exports.assertion = function(selector, text, msg) {
  this.DEFAULT_MSG = this.DEFAULT_MSG || 'Testing if textContent of <%s> equals "%s".';

  this.message = msg || util.format(this.DEFAULT_MSG, selector, text);

  this.expected = text;
  this.value = () => this.result;

  this.pass = () => text === this.result;

  this.command = function(callback) {
    return this.api.execute(function(selector) {
      var element = document.querySelector(selector);

      return element.textContent;
    }, [ selector ], (result) => {
      this.result = result.value;
      callback(result);
    });
  }

};
