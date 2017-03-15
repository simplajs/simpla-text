const init = () => (browser) => {
  browser
    .url('http://localhost:3333/')
    .setProperty('simpla-text', 'editable', true)
    .pause(500) // Wait for async loads to occur
    .click('simpla-text')
    .keys('Hello World')
    .saveScreenshot('./screenshots/toolbar/init.png');
}

const highlight = () => (browser) => {
  browser
    .highlightLastWord()
    .saveScreenshot('./screenshots/toolbar/highlight.png');
}

const checkCommand = ({ name, tag }) => (browser) => {
  browser
    .clickOnCommand(name)
    .saveScreenshot(`./screenshots/toolbar/${name}.png`)
    .verify.containsTag('simpla-text', tag)
    .clickOnCommand(name)
    .verify.doesNotContainTag('simpla-text', tag);
}

module.exports = {
  'init': init(),

  'Shows on highlight': highlight(),

  'Bolds text': checkCommand({ name: 'bold', tag: 'strong' }),
  'Italicises text': checkCommand({ name: 'italic', tag: 'em' }),
  'Underlines text': checkCommand({ name: 'underline', tag: 'u' }),

  'Creating / Updating Links': function(browser) {
    browser
      .clickOnCommand('link')
      .saveScreenshot('./screenshots/toolbar/link-open.png')
      .keys([ 'http://xkcd.com/', browser.Keys.ENTER ])
      .verify.containsTag('simpla-text', 'a')
      // Note we're using contains here as an anchor tag will normalize the URL
      .verify.attributeEquals('simpla-text a', 'href', 'http://xkcd.com/')
      .saveScreenshot('./screenshots/toolbar/added-link.png')

      // This is because after creating a link, it loses focus, in future we
      //  should probably patch this, and remove these lines
      .click('simpla-text')
      // Move to the end of text
      .highlightLastWord()
      .clickOnCommand('link')

      // Essentially highlight all, but CMD+a isn't working for some reason...
      .moveCursor('right')
      .highlight(10, 'words', 'left')
      .keys(browser.Keys.BACK_SPACE)
      .keys([ 'http://google.com/', browser.Keys.ENTER ])
      .verify.containsTag('simpla-text', 'a')
      .verify.attributeEquals('simpla-text a', 'href', 'http://google.com/')
  },

  'Removing Links': function(browser) {
    browser
      .click('simpla-text')
      .highlightLastWord()
      .clickOnCommand('link')

      .moveCursor('right')
      .highlight(10, 'words', 'left')

      .keys([ browser.Keys.BACK_SPACE, browser.Keys.ENTER ])
      .verify.doesNotContainTag('simpla-text', 'a')
  },

  'finish': (browser) => browser.end()
}
