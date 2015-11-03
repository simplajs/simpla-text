const isShadow = window.Polymer.Settings.useNativeShadow;
let common,
    shadow,
    shady;

common = {
  properties: {
    _scribeTarget: Object
  }
};

shadow = {
  attached() {
    this._scribeTarget = this;
  }
};

shady = {
  attached() {
    let target = document.createElement('div');
    target.className = 'simpla-text simpla-text__wrapper';

    this._scribeTarget = target;
    this._targetWrap();
  },

  _targetWrap() {
    let dom = Polymer.dom(this),
        children = dom.childNodes,
        target = this._scribeTarget;

    // Check if already wrapped
    if (children.indexOf(target) !== -1) {
      return;
    }

    children.forEach(el => {
      // Add child to the wrapper element
      target.appendChild(el);
      // Remove it from the host DOM api - normally this would be a live NodeList
      //  and then we'd be able to just leave it with the above appendChild, but
      //  as DOM API is dealing with Arrays, we need to remove it explicitly
      dom.removeChild(el);
    });
    // Append wrapper to dom host
    dom.appendChild(target);
  }
};

export default Object.assign(common, isShadow ? shadow : shady);
