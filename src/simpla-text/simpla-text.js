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
    return commands.trim().split(/\s+/);
  }
}

Polymer(SimplaText);
