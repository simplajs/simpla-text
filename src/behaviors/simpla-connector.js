const warnOnInvalidPath = error => {
  if (error.message.toLowerCase().indexOf('invalid path') !== -1) {
    console.warn(error.message);
  } else {
    throw error;
  }
}

export default {
  properties: {

    path: {
      type: String,
      observer: '_observePath'
    },

    loaded: {
      type: Boolean,
      value: false,
      readOnly: true,
      notify: true
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

    Simpla.get(this.path).then(callback).catch(warnOnInvalidPath);

    try {
      return Simpla.observe(this.path, callback);
    } catch (error) {
      warnOnInvalidPath(error);
    }

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
    const isValid = item && item.data && item.data.text,
          currentValue = this.value;

    if (isValid && currentValue !== item.data.text) {
      this.value = item.data.text;
    }
    this._setLoaded(true);
  },
  
  _setToSimpla() {
    if (this.path) {
      Simpla.set(this.path, {
        type: 'Text',
        data: { text: this.value }
      }).catch(warnOnInvalidPath);
    }
  }
}
