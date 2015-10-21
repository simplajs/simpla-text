let corePersists,
    customPersists;

corePersists = simpla.behaviors.persists('api');
customPersists = {
  listeners: {
    'loaded': '_updateFromLoad'
  },

  _toObject() {
    return { text: this.value };
  },

  _fromObject(value) {
    this.value = value.text;
  },

  _equal(textA, textB) {
    return !!(textA && textB) &&
          textA.text === textB.text;
  },

  _updateFromLoad({ detail }) {
    this._fromObject(detail.value);
  }
};

export default [ corePersists, customPersists ];
