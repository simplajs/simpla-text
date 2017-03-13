const tagExp = (tag) => new RegExp(`<${tag}(.+)?>(.+)?<\/${tag}>`);

const init = () => (browser) => {
  browser
    .url(`http://localhost:3333/toolbar.html`)
    .setProperty('simpla-text', 'editable', true)
    .pause(500) // Wait for async loads to occur
    .click('simpla-text')
    .keys('Hello World')
    .saveScreenshot('./screenshots/toolbar-init.png');
}

const highlight = () => (browser) => {
  browser
    .highlight(1, 'left', 'word')
    .saveScreenshot('./screenshots/toolbar-highlight.png');
}

const checkCommand = ({ name, tag }) => (browser) => {
  browser
    .clickOnCommand(name)
    .saveScreenshot(`./screenshots/toolbar-${name}.png`)
    .perform(function() {
      browser.expect.element('simpla-text').to.have.value.which.matches(tagExp(tag))
    })
    .clickOnCommand(name);
}

module.exports = {
  'init': init(),

  'Shows on highlight': highlight(),

  'Bolds text': checkCommand({ name: 'bold', tag: 'strong' }),
  'Italicises text': checkCommand({ name: 'italic', tag: 'em' }),
  'Underlines text': checkCommand({ name: 'underline', tag: 'u' })
}
