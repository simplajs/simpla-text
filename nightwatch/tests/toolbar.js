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
    .highlight(1, 'left', 'word')
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

  'Bolds text': checkCommand({ name: 'toggle-bold', tag: 'strong' }),
  'Italicises text': checkCommand({ name: 'toggle-italic', tag: 'em' }),
  'Underlines text': checkCommand({ name: 'toggle-underline', tag: 'u' }),

  'finish': (browser) => browser.end()
}
