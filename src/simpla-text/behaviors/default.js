let coreDefault,
    customDefault;

coreDefault = simpla.behaviors.default();
customDefault = {
  properties: {
    useDefault: {
      type: Boolean,
      observer: '_useDefaultChanged',
      value: false
    }
  },

  observers: [
    '_updateDefault(useDefault, _default)'
  ],

  _updateDefault(useDefault, _default) {
    if (useDefault) {
      this.value = this._default;
    }
  },

  _useDefaultChanged(value) {
    if (value && this._default) {
      this.value = this._default;
    }
  },

  _setDefaultAttribute(value) {
    this._default = value;
  },

  _setDefaultElement(element) {
    this._default = Polymer.dom(element).innerHTML;
  }
};

export default [ coreDefault, customDefault ];
