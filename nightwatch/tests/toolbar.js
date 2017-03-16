const init = () => (browser) => {
  browser
    .url('http://localhost:3333/')
    .setProperty('#main', 'editable', true)
    .pause(500) // Wait for async loads to occur
    .click('#main')
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
    .clickOnCommand('#main', name)
    .saveScreenshot(`./screenshots/toolbar/${name}.png`)
    .verify.elementPresent(`#main ${tag}`, `Added ${tag} tag`)
    .verify.inSyncWith('#main', '#mirror', `Synced addition of ${tag}`)
    .clickOnCommand('#main', name)
    .verify.elementNotPresent(`#main ${tag}`, `Removed ${tag} tag`)
    .verify.inSyncWith('#main', '#mirror', `Synced removal of ${tag}`)
}

module.exports = {
  'init': init(),

  'Shows on highlight': highlight(),

  'Bolds text': checkCommand({ name: 'bold', tag: 'strong' }),
  'Italicises text': checkCommand({ name: 'italic', tag: 'em' }),
  'Underlines text': checkCommand({ name: 'underline', tag: 'u' }),

  'Creating / Updating Links': function(browser) {
    browser
      .clickOnCommand('#main', 'link')
      .saveScreenshot('./screenshots/toolbar/link-open.png')
      .keys([ 'http://xkcd.com/', browser.Keys.ENTER ])
      .verify.elementPresent('#main a')
      // Note we're using contains here as an anchor tag will normalize the URL
      .verify.attributeEquals('#main a', 'href', 'http://xkcd.com/')
      .verify.inSyncWith('#main', '#mirror')
      .saveScreenshot('./screenshots/toolbar/added-link.png')

      // This is because after creating a link, it loses focus, in future we
      //  should probably patch this, and remove these lines
      .click('#main')
      // Move to the end of text
      .highlightLastWord()
      .clickOnCommand('#main', 'link')

      // Essentially highlight all, but CMD+a isn't working for some reason...
      .moveCursor('right')
      .highlight(10, 'words', 'left')
      .keys(browser.Keys.BACK_SPACE)
      .keys([ 'http://google.com/', browser.Keys.ENTER ])
      .verify.elementPresent('#main a')
      .verify.attributeEquals('#main a', 'href', 'http://google.com/')
      .verify.inSyncWith('#main', '#mirror')
  },

  'Removing Links': function(browser) {
    browser
      .click('#main')
      .highlightLastWord()
      .clickOnCommand('#main', 'link')

      .moveCursor('right')
      .highlight(10, 'words', 'left')

      .keys([ browser.Keys.BACK_SPACE, browser.Keys.ENTER ])
      .verify.elementNotPresent('#main a')
      .verify.inSyncWith('#main', '#mirror')
  },

  'finish': (browser) => browser.end()
}
