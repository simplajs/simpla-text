const placeholder = 'Yo! Type something :)';

module.exports = {
  'Setup and initial placeholder': (browser) => {
    browser
      .url('http://localhost:3333/')
      .pause(500)
      .setProperty('#main', 'placeholder', placeholder)
      .setProperty('#main', 'editable', true)
      .pause(500) // Wait for async loads to occur
      .verify.textContent('#main', placeholder)
      .saveScreenshot('./screenshots/placeholder/init-with-placeholder.png')
      .click('#main')
      .keys('Hello World')
      .saveScreenshot('./screenshots/placeholder/after-input.png');
  },

  'Show placeholder while editable and empty': (browser) => {
    browser
      .click('#main')
      .moveCursor('right')
      .highlight(10, 'words', 'left')
      .keys([ browser.Keys.BACK_SPACE ])
      .click('body')
      .verify.textContent('#main', placeholder)
      .saveScreenshot('./screenshots/placeholder/blurred-show.png');
  },

  'Hide placeholder while focused': (browser) => {
    browser
      .click('#main')
      .verify.textContent('#main', '')
      .saveScreenshot('./screenshots/placeholder/focused-hide.png');
  },

  'Hide placeholder while editing and has content': (browser) => {
    browser
      .click('#main')
      .moveCursor('right')
      .highlight(10, 'words', 'left')
      .keys([ browser.Keys.BACK_SPACE ])
      .keys('Hello World')
      .click('body')
      .verify.textContent('#main', 'Hello World')
      .saveScreenshot('./screenshots/placeholder/blurred-hide.png');
  },

  'Hide placeholder if not editable': (browser) => {
    browser
      .click('#main')
      .moveCursor('right')
      .highlight(10, 'words', 'left')
      .keys([ browser.Keys.BACK_SPACE ])
      .click('body')
      .setProperty('#main', 'editable', false)
      .verify.textContent('#main', '')
      .saveScreenshot('./screenshots/placeholder/blurred-not-editable.png');
  },

  'Finish': (browser) => browser.end()
}
