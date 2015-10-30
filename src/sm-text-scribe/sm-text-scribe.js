import Scribe from 'scribe-editor';
import { INLINE_ELEMENTS } from './constants';

class SmHelperScribe {
  beforeRegister() {
    this.is = 'sm-text-scribe';

    this.properties = {
      value: {
        type: String,
        value: '',
        observer: '_valueChanged',
        notify: true
      },
      commands: {
        type: Array,
        observer: '_commandsObserver'
      },
      inline: Boolean,
      block: Boolean,
      readonly: Boolean,
      placeholder: String,
      _scribe: Object,
      toolbar: Object
    };

    this.observers = [
      '_linkScribeWithToolbar(_scribe, toolbar)'
    ];
  }

  get behaviors() {
    return [
      simpla.behaviors.editable()
    ];
  }

  ready() {
    let target = this.$['container'];
    this._setupScribe(target);
  }

  parseCommands(commands) {
    return commands.trim().split(/\s+/);
  }

  /**
   * Returns true if inline
   * @return {boolean}
   */
  shouldInline() {
    let parent,
        name,
        shouldBeInline;

    if (this.inline) {
      return true;
    }

    if (this.block) {
      return false;
    }

    parent = this.parentNode;
    name = parent.nodeName.toLowerCase();
    shouldBeInline = INLINE_ELEMENTS.indexOf(name) !== -1;

    return shouldBeInline;
  }

  focus(...args) {
    this._scribe.el.focus(...args);
  }

  _fireFocus() {
    this.fire('focus');
  }

  _fireBlur() {
    this.fire('blur');
  }

  _setupScribe(target) {
    this._scribe = new Scribe(target);

    this._scribe.on('content-changed', () => {
      // Use getHTML instead of getContent so as not to apply 'for export'
      //  formatting. See https://github.com/guardian/scribe/blob/master/src/scribe.js#L147
      this.value = this._scribe.getHTML();
    });

    this._scribe.el.addEventListener('focus', () => {
      // Temporary to stop bug where returns keep getting input,
      //  and cursor returns to start
      if (this._scribe.getHTML().indexOf('<content></content>') !== -1 && !this.inline) {
        this._scribe.setHTML('<p></p>');
      }
    });

    // Make sure the contenteditable attribute is reset as it may have been
    //  override by scribe during setup
    this.toggleAttribute('contenteditable', this.editable, target);
  }

  _valueChanged(value) {
    // Note we use setHTML as setContent will trigger a content-changed event
    //  which will set off an infinite loop
    if (this._scribe && this._scribe.setHTML) {
      this._scribe.setHTML(value);
    }
  }

  _commandsObserver(value) {
    this._scribe._smEnabled = value;
  }

  _linkScribeWithToolbar(scribe, toolbar) {
    toolbar.use(scribe);
  }
}

Polymer(SmHelperScribe);
