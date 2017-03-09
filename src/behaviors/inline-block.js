const INLINE_ELEMENTS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'li', 'dd', 'figcaption', 'mark', 'q', 's', 'time','u', 'legend', 'option',
  'b', 'big', 'i', 'small', 'tt', 'abbr', 'acronym', 'cite', 'pre', 'code', 'dfn', 'em', 'kbd', 'strong', 'samp', 'var',
  'a', 'span', 'sub', 'sup', 'button', 'label'
];

export default {
  properties: {
    inline: {
      type: Boolean,
      observer: '_inlineObserver'
    },

    block: {
      type: Boolean,
      observer: '_blockObserver'
    }
  },

  attached() {
    this._autoSetMode();
  },

  _inlineObserver(inline) {
    this.block = !inline;
  },

  _blockObserver(block) {
    this.inline = !block
  },

  _autoSetMode() {
    let parentName = this.parentElement && this.parentElement.nodeName.toLowerCase();

    if (typeof this.inline !== 'undefined' || typeof this.block !== 'undefined') {
      return;
    }

    this.inline = INLINE_ELEMENTS.indexOf(parentName) !== -1;
  }
}
