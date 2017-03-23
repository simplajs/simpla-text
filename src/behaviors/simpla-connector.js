export default {
  properties: {
    editable: {
      type: Boolean,
      reflectToAttribute: true
    },

    uid: {
      type: String,
      observer: '_observeUid'
    }
  },

  listeners: {
    'input': '_setToSimpla'
  },

  attached() {
    this._attached = true;

    this._observers = {
      editable: this._observeAndInitEditable(),
      uid: this.uid && this._observeAndInitUid()
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

  _observeAndInitUid() {
    let callback = item => this._restoreFromSimpla(item);

    Simpla.get(this.uid).then(callback);
    return Simpla.observe(this.uid, callback);
  },

  _observeUid(uid) {
    if (this._attached) {
      if (this._observers.uid) {
        this._observers.uid.unobserve();
      }

      if (uid) {
        this._observers.uid = this._observeAndInitUid();
      }
    }
  },

  _restoreFromSimpla(item) {
    if (item && this.value !== item.data.text) {
      this.value = item.data.text;
    }
  },

  _setToSimpla() {
    if (this.uid) {
      Simpla.set(this.uid, {
        type: 'Text',
        data: {
          text: this.value
        }
      })
    }
  }
}
