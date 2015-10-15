class SimplaText {
  beforeRegister() {
    this.is = 'simpla-text';
  }

  get behaviors() {
    return [
      simpla.behaviors.editable
    ];
  }
}

Polymer(SimplaText);
