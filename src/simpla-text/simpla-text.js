import defaultBehavior from './behaviors/default';
import persists from './behaviors/persists';
import scribeTarget from './behaviors/scribeTarget';

class SimplaText {
  beforeRegister() {
    this.is = 'simpla-text';

    this.properties = {
      tools: {
        type: String,
        value: ''
      },
      _commands: {
        type: Array,
        computed: '_parseCommands(tools)'
      },
      value: {
        type: String,
        value: '',
        observer: '_valueChanged'
      },
      _toolbar: Object,
      _container: Object,
      inline: Boolean,
      block: Boolean,
      scribe: {
        type: Object,
        observer: '_scribeChanged'
      }
    };

    this.listeners = {
      'tap': '_tapHandler'
    };
  }

  attached() {
    this._container = this.parentElement;
  }

  _parseCommands(commands) {
    const trimmed = commands ? commands.trim() : '';
    return trimmed === '' ? null : trimmed.split(/\s+/);
  }

  get behaviors() {
    return [].concat(
      simpla.behaviors.editable({
        observer: '_checkPlaceholder'
      }),
      simpla.behaviors.placeholder({
        value: 'Enter your text...'
      }),
      simpla.behaviors.utilityAssign,
      scribeTarget,
      defaultBehavior,
      persists
    );
  }

  _valueChanged() {
    this._checkPlaceholder();
  }

  _disablePlaceholder() {
    this.usePlaceholder = false;
  }

  _isEmpty() {
    let dummy = document.createElement('div');
    dummy.innerHTML = this.value;

    return dummy.textContent === '';
  }

  _checkPlaceholder() {
    if (this._isEmpty() && this.editable) {
      this.usePlaceholder = true;
    } else {
      this.usePlaceholder = false;
    }
  }

  _tapHandler() {
    this.editable && this.$.scribe.focus();
  }

  _scribeChanged(scribe) {
    const inline = !scribe.options.allowBlockElements;

    this.toggleAttribute('inline', inline);
    this.toggleAttribute('block', !inline);

    if (inline) {
      this.customStyle['--placeholder-width'] = this.$.placeholder.offsetWidth + 'px';
      this.updateStyles();
    }
  }

}

Polymer(SimplaText);
