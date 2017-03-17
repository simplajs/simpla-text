const assert = require('assert');

const getBounds = (selector, callback) => (browser) => {
  browser
    .execute(function() {
      var toolbar = document.querySelector('simpla-text-toolbar');

      return {
        toolbar: toolbar.getBoundingClientRect(),
        window: {
          top: window.scrollY,
          left: window.scrollX,
          width: window.innerWidth,
          height: window.innerHeight,
          right: window.innerWidth + window.scrollX,
          bottom: window.innerHeight + window.scrollY
        },
        range: window.getSelection().getRangeAt(0).getBoundingClientRect()
      };
    }, [], callback);
}

const checkToolbarInWindow = (browser) => {
  getBounds(function(response) {
    let { toolbar, window } = response.value;

    assert(toolbar.top > window.top, 'Toolbar top is within window');
    assert(toolbar.left > window.left, 'Toolbar left is within window');
    assert(toolbar.right < window.right, 'Toolbar right is within window');
    assert(toolbar.bottom < window.bottom, 'Toolbar bottom is within window');
  })(browser);
}

const checkToolbarNotOverRange = (browser) => {
  getBounds(function(response) {
    let { toolbar, range } = response.value;

    assert(
      toolbar.bottom < range.top || toolbar.top > range.bottom,
      'Toolbar is not over range vertically'
    );

  })(browser);
}

const clickOnCorner = (y, x) => (browser) => {
  let selector = `.${y}.${x}`;

  browser
    .click(selector)
    .highlight(2, 'word', 'right')
    .saveScreenshot(`./screenshots/toolbar-positioning/${y}-${x}.png`)

  checkToolbarInWindow(browser);
  checkToolbarNotOverRange(browser);
};

module.exports = {
  'init': function(browser) {
    browser
      .url('http://localhost:3333/toolbar-positioning.html')
      .pause(500)
  },

  'Positions out from top left': clickOnCorner('top', 'left'),
  'Positions out from top right': clickOnCorner('top', 'right'),
  'Positions out from bottom right': clickOnCorner('bottom', 'right'),
  'Positions out from bottom left': clickOnCorner('bottom', 'left'),

  'finish': (browser) => browser.end()
}
