let coreDefault,
    customDefault;

// Import core behavior from simpla globals
coreDefault = simpla.behaviors.default();

// Define abstract methods in custom behavior and extend core
customDefault = {
  properties: {

    /**
     * Whether to use the default value or not
     * @type {Boolean}
     */
    useDefault: {
      type: Boolean,
      observer: '_useDefaultChanged',
      value: false
    }
  },

  observers: [
    '_updateDefault(useDefault, _default)'
  ],

  /**
   * Updates the value from this._default when useDefault is true and _default is
   * 	defined. _default is optional as changes are just used to trigger the function
   * @param  {Boolean} useDefault Whether to use default value or not
   * @param  {String?} _default    Value of default
   * @return {undefined}
   */
  _updateDefault(useDefault, _default) {
    if (useDefault) {
      this.value = this._default;
    }
  },

  /**
   * Observer for useDefault. Sets this.value to this._default if value is true
   * @param  {Boolean} value Whether to useDefault or not
   * @return {undefined}
   */
  _useDefaultChanged(value) {
    if (value && this._default) {
      this.value = this._default;
    }
  },

  /**
   * Set value of default from attribute value
   * @param {String} value Value of default
   * @return {undefined}
   */
  _setDefaultAttribute(value) {
    this._default = value;
  },

  /**
   * Set value of default from element, by setting it to the innerHTML of element
   * @param {HTMLElement} element HTMLElement element to extract innerHTML from
   * @return {undefined}
   */
  _setDefaultElement(element) {
    this._default = Polymer.dom(element).innerHTML;
  }
};

export default [ coreDefault, customDefault ];
