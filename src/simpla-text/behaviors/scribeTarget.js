/**
 * Generates a behavior to set the scribeTarget of the element. The behavior is
 * 	different depending on if using Shadow DOM or Shady DOM.
 */

const isShadow = window.Polymer.Settings.useNativeShadow;
let common,
    shadow,
    shady;

/**
 * Common behavior to be used by both shadow and shady
 */
common = {
  properties: {
    _scribeTarget: Object
  }
};

/**
 * Behavior to use when using native shadow DOM. In this case, _scribeTarget is
 * 	set to this node directly, as the Shadow DOM is protected by the Shadow boundary
 */
shadow = {
  attached() {
    this._scribeTarget = this;
  }
};

/**
 * Behavior to use when using Shady DOM. In this case, the _scribeTarget is a new
 * 	wrapper element that protects the text contents. This stops the
 * 	local DOM from being deleted while in edit mode.
 */
shady = {
  attached() {
    let target = document.createElement('div');
    target.className = 'simpla-text simpla-text__wrapper';

    this._targetWrap(target);
    this._scribeTarget = target;
  },

  /**
   * Wrap the contents of this node with the given target. Enforces all direct
   * 	children to be moved into the target. Does nothing if child nodes are already
   * 	wrapped
   * @param {HTMLElement} target Target element
   * @return {undefined}
   */
  _targetWrap(target) {
    let dom = Polymer.dom(this),
        children = dom.childNodes;

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
