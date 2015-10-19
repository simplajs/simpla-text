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
      }
    };
  }

  _parseCommands(commands) {
    const trimmed = commands ? commands.trim() : '';
    return trimmed === '' ? null : trimmed.split(/\s+/);
  }

  get behaviors() {
    return [
      simpla.behaviors.editable(),
      simpla.behaviors.placeholder()
    ];
  }
}

Polymer(SimplaText);
