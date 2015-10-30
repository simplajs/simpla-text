let corePersists,
    customPersists;

corePersists = simpla.behaviors.persists('api');
customPersists = {
  listeners: {
    'api.loaded': '_updateFromLoad'
  },

  observers: [
    '_uidChanged(uid)'
  ],

  _toObject() {
    return { text: this.value };
  },

  _fromObject(value) {
    if (!value || Object.keys(value).length === 0) {
      this.useDefault = true;
    } else {
      this.value = value.text || '';
    }
  },

  _equal(textA, textB) {
    return !!(textA && textB) &&
          textA.text === textB.text;
  },

  _updateFromLoad({ detail }) {
    this._fromObject(detail.value);
  },

  _uidChanged() {
    this.load()
  }
};

export default [ corePersists, customPersists ];
