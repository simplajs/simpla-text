const util = require('util');
const tagExp = (tag) => new RegExp(`<${tag}(.+)?>(.+)?<\/${tag}>`);

/**
 * Checks if the given form element's innerHTML contains the expected tag.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.elementContainsTag("simpla-text", "strong");
 *    };
 * ```
 */

exports.assertion = function(selector, tag, msg) {
  this.DEFAULT_MSG = this.DEFAULT_MSG || 'Testing if innerHTML of <%s> contains "%s" tag.';

  this.message = msg || util.format(this.DEFAULT_MSG, selector, tag);
  this.expected = true;

  this.pass = (value) => this.expected === !!tagExp(tag).test(value);
  this.value = (result) => result.value;

  this.command = function(callback) {
    return this.api.execute(function(selector) {
      var element = document.querySelector(selector);
      return element.innerHTML;
    }, [ selector ], callback);
  }

};
