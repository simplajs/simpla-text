export default {
  properties: {
    editable: {
      type: Boolean,
      reflectToAttribute: true,
      value: () => Simpla.getState('editable')
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
    this._observers = {
      editable: Simpla.observeState('editable', editable => {
        this.editable = editable;
      })
    };

    if (this.uid) {
      this._attachUidObserver();
    }

    this._attached = true;
  },

  detached() {
    Object.keys(this._observers || {})
      .map(prop => this._observers[prop])
      .forEach(observer => observer.unobserve());
  },

  _observeUid(uid) {
    if (this._attached && uid) {
      Simpla.get(uid).then(item => this._restoreFromSimpla(item));
      this._attachUidObserver();
    }
  },

  _attachUidObserver() {
    if (this._observers.uid) {
      this._observers.uid.unobserve();
    }

    this._observers.uid = Simpla.observe(
      this.uid,
      (item) => this._restoreFromSimpla(item)
    );
  },

  _restoreFromSimpla(item) {
    let data;

    if (!item) {
      return;
    }

    data = item.data;

    if (this.innerHTML !== data.html) {
      this.innerHTML = data.html;
    }
  },

  _setToSimpla() {
    if (!this.uid) {
      return;
    }

    Simpla.set(this.uid, {
      type: 'Text',
      data: {
        html: this.innerHTML
      }
    })
  }
}
