let corePersists,
    customPersists;

// Core perists behavior to extend
corePersists = simpla.behaviors.persists('api');

// Custom persists behavior to extend core and implement abstract functions
customPersists = {
  listeners: {
    'api.loaded': '_updateFromLoad'
  },

  observers: [
    '_uidChanged(uid)'
  ],

  /**
   * Converts current element to Object that can be stored in a JSON db
   * @return {Object} Object form of element
   */
  _toObject() {
    return { text: this.value };
  },

  /**
   * Setup current value from given Object. Takes value.text and uses as value,
   * 	defaulting to ''. Sets useDefault to true if value is falsey or it has no
   * 	enumerable keys
   * @param  {Object} value Object to setup from
   * @return {undefined}
   */
  _fromObject(value) {
    if (!value || Object.keys(value).length === 0) {
      this.useDefault = true;
    } else {
      this.value = value.text || '';
    }
  },

  /**
   * Check if both textA and textB are equal simpla-text elements.
   * Note: returns false if textA or textB are falsey, even if both are falsey
   * @param  {HTMLElement} textA  Text element to compare against
   * @param  {HTMLElement} textB  Text element to compare with
   * @return {Boolean}            True if textA and textB are equal in value, false
   *                                otherwise
   */
  _equal(textA, textB) {
    return !!(textA && textB) &&
          textA.text === textB.text;
  },

  /**
   * Update the current value from the load event
   * @param  {CustomEvent} event  Load event fired from sm-utility-connect
   * @return {undefined}
   */
  _updateFromLoad({ detail }) {
    this._fromObject(detail.value);
  },

  /**
   * Observer for uid property. Re-loads the current data by calling this.load
   * @return {undefined}
   */
  _uidChanged() {
    this.load()
  }
};

export default [ corePersists, customPersists ];
