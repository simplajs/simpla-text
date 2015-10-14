import Scribe from 'scribe-editor';

class SmHelperScribe {
  beforeRegister() {
    this.is = 'sm-text-scribe';

    this.properties = {
      value: {
        type: String,
        value: '',
        observer: '_valueChanged'
      },
      commands: String,
      _commands: {
        type: Array,
        computed: 'parseCommands(commands)'
      },
      inline: Boolean,
      block: Boolean,
      readonly: Boolean,
      placeholder: String
    };
  }

  ready() {
    let target = this.$['container'];
    this._scribe = new Scribe(target);

    this._scribe.on('content-changed', () => {
      this.value = this._scribe.getContent();
    });
  }

  parseCommands(commands) {
    return commands.trim().split(/\s+/);
  }

  _valueChanged(value) {
    // Note we use setHTML as setContent will trigger a content-changed event
    //  which will set off an infinite loop
    if (this._scribe && this._scribe.setHTML) {
      this._scribe.setHTML(value);
    }
  }

  /**
   * Returns true if inline
   * @return {boolean}
   */
  shouldInline() {
    if (this.inline) {
      return true;
    }

    if (this.block) {
      return false;
    }

    return false;
  }
}

Polymer(SmHelperScribe);
