import Scribe from 'scribe-editor';
import { INLINE_ELEMENTS } from './constants';
import { bindCommands } from './utils/command-control';

class SmHelperScribe {
  beforeRegister() {
    this.is = 'sm-text-scribe';

    this.properties = {
      value: {
        type: String,
        value: '',
        observer: '_valueChanged'
      },
      commands: {
        type: Array,
        observer: '_commandsObserver'
      },
      inline: Boolean,
      block: Boolean,
      readonly: Boolean,
      placeholder: String
    };
  }

  get behaviors() {
    return [
      simpla.behaviors.editable
    ];
  }

  ready() {
    let target = this.$['container'];
    this._setupScribe(target);
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

  _setupScribe(target) {
    this._scribe = new Scribe(target);

    this._scribe.on('content-changed', () => {
      // Use getHTML instead of getContent so as not to apply 'for export'
      //  formatting. See https://github.com/guardian/scribe/blob/master/src/scribe.js#L147
      this.value = this._scribe.getHTML();
    });
  }

  _valueChanged(value) {
    // Note we use setHTML as setContent will trigger a content-changed event
    //  which will set off an infinite loop
    if (this._scribe && this._scribe.setHTML) {
      this._scribe.setHTML(value);
    }
  }

  _commandsObserver(value) {
    bindCommands(value);
  }
}

Polymer(SmHelperScribe);
