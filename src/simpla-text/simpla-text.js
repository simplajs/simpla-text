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
      simpla.behaviors.placeholder()
    ];
  }

  _valueChanged() {
    this._checkPlaceholder();
  }

  _disablePlaceholder() {
    this.usePlaceholder = false;
  }

  _checkPlaceholder() {
    if (this.value === '' && this.editable) {
      this.usePlaceholder = true;
    } else {
      this.usePlaceholder = false;
    }
  }
}

Polymer(SimplaText);
