const util = require('util');

/**
 * Checks if both given element's values match
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.inSyncWith(".source", ".replica");
 *    };
 * ```
 */

exports.assertion = function(source, mirror, msg) {
  this.DEFAULT_MSG = this.DEFAULT_MSG || 'Testing if value of <%s> and <%s> match.';

  this.message = msg || util.format(this.DEFAULT_MSG, source, mirror);

  this.expected = () => this.result.value[0];
  this.value = () => this.result.value[1];

  this.pass = () => this.result.value[0] === this.result.value[1];

  this.command = function(callback) {
    return this.api.execute(function(sourceSelector, mirrorSelector) {
      var sourceEl = document.querySelector(sourceSelector),
          mirrorEl = document.querySelector(mirrorSelector);

      return [ sourceEl.value, mirrorEl.value ];
    }, [ source, mirror ], (result) => {
      this.result = result;
      callback(result);
    });
  }

};
