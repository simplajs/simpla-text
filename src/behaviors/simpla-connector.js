export default {
  properties: {

    path: {
      type: String,
      observer: '_observePath'
    }

  },

  listeners: {
    'input': '_setToSimpla'
  },

  attached() {
    this._attached = true;

    this._observers = {
      editable: this._observeAndInitEditable(),
      path: this.path && this._observeAndInitPath()
    };
  },

  detached() {
    this._attached = false;

    Object.keys(this._observers || {})
      .forEach(key => this._observers[key] && this._observers[key].unobserve());
  },

  _observeAndInitEditable() {
    if (typeof this.editable === 'undefined') {
      this.editable = Simpla.getState('editable');
    }

    return Simpla.observeState('editable', editable => {
      this.editable = editable;
    });
  },

  _observeAndInitPath() {
    let callback = item => this._restoreFromSimpla(item);

    Simpla.get(this.path).then(callback);
    return Simpla.observe(this.path, callback);
  },

  _observePath(path) {
    if (this._attached) {
      if (this._observers.path) {
        this._observers.path.unobserve();
      }

      if (path) {
        this._observers.path = this._observeAndInitPath();
      }
    }
  },

  _restoreFromSimpla(item) {
    if (item && this.value !== item.data.text) {
      this.value = item.data.text;
    }
  },

  _setToSimpla() {
    if (this.path) {
      Simpla.set(this.path, {
        type: 'Text',
        data: {
          text: this.value
        }
      })
    }
  }
}
