const init = () => (browser) => {
  browser
    .url('http://localhost:3333/')
    .setProperty('simpla-text', 'editable', true)
    .pause(500) // Wait for async loads to occur
    .click('simpla-text')
    .keys('Hello World')
    .highlight(1, 'word', 'left')
    .saveScreenshot('./screenshots/keyboard/init.png');
}

const checkCommand = ({ name, key, tag, mod }) => (browser) => {
  browser.pressKeys = () => {
    return browser
      .keys(mod || browser.Keys.COMMAND)
      .keys(key)
      .keys(browser.Keys.NULL);
  }

  browser
    .pressKeys()
    .verify.elementPresent(`simpla-text ${tag}`, `Added ${tag} tag`)
    .saveScreenshot(`./screenshots/keyboard/${name}.png`)
    // Now just check it can toggle it back off
    .pressKeys()
    .verify.elementNotPresent(`simpla-text ${tag}`, `Removed ${tag} tag`)
}

module.exports = {
  'init': init(),

  'Bolding': checkCommand({ name: 'bold', key: 'b', tag: 'strong' }),
  'Italic': checkCommand({ name: 'italic', key: 'i', tag: 'em' }),
  'Underline': checkCommand({ name: 'undeliner', key: 'u', tag: 'u' }),

  'Finish': (browser) => browser.end()
}
