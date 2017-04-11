module.exports = {
  'Initialize': (browser) => {
    browser
      .url('http://localhost:3333/plaintext.html')
      .setProperty('#main', 'editable', true)
      .pause(500) // Wait for async loads to occur
      .click('#main')
      .keys('Hello World')
      .saveScreenshot('./screenshots/plaintext/init.png');
  },

  'Should not show toolbar': (browser) => {
    browser
      .click('#main')
      .highlightLastWord()
      .verify.hidden('simpla-text-toolbar');
  },

  'Cleanup': (browser) => browser.end()
}
