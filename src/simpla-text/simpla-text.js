import { TYPOGRAPHY_PROPS } from './constants/typography';
import camelToKebab from './utils/camelToKebab';

class SimplaText {
  beforeRegister() {
    this.is = 'simpla-text';

    this.properties = {
      commands: {
        type: String,
        value: ''
      },
      _commands: {
        type: Array,
        computed: '_parseCommands(commands)'
      },
      value: {
        type: String,
        value: '',
        observer: '_valueChanged'
      }
    };

    this.listeners = {
      'tap': '_tapHandler'
    };
  }

  attached() {
    this._passthroughTextStyles();
  }

  _parseCommands(commands) {
    const trimmed = commands ? commands.trim() : '';
    return trimmed === '' ? null : trimmed.split(/\s+/);
  }

  get behaviors() {
    return [
      simpla.behaviors.editable({
        observer: '_checkPlaceholder'
      }),
      simpla.behaviors.placeholder({
        value: 'Enter your text'
      })
    ];
  }

  _valueChanged() {
    this._checkPlaceholder();
  }

  _disablePlaceholder() {
    this.usePlaceholder = false;
  }

  _isEmpty() {
    return this.value === '' || this.value === '<p><br></p>';
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

  _passthroughTextStyles() {
    // Add mixin values
    const styles = window.getComputedStyle(this);

    let passthroughTypography = '';
    TYPOGRAPHY_PROPS.forEach(prop => {
      let style = styles[prop],
          kebabProp = camelToKebab(prop);
      passthroughTypography += `${kebabProp}: ${style};`;
    });

    this.customStyle['--passthrough-typography'] = passthroughTypography;
    this.updateStyles();
  }
}

Polymer(SimplaText);
