import defaultBehavior from './behaviors/default';
import persists from './behaviors/persists';
import scribeTarget from './behaviors/scribeTarget';

class SimplaText {
  beforeRegister() {
    this.is = 'simpla-text';

    this.properties = {
      /**
       * String of tools to use. None means all available
       * @type {Object}
       */
      tools: {
        type: String,
        value: ''
      },

      /**
       * Computed command property, Array version of commands from tools
       * @type {Array}
       */
      _commands: {
        type: Array,
        computed: '_parseCommands(tools)'
      },

      /**
       * Value of simpla-text, equivalent to a regular div's innerHTML value
       * @type {String}
       */
      value: {
        type: String,
        value: '',
        observer: '_valueChanged'
      },

      /**
       * Instance of toolbar object
       * @type {Object}
       */
      _toolbar: {
        value: window.SmUiToolbar.singleton
      },

      /**
       * Parent element of current element. Used to check if should be inline or
       * 	block formatted text
       * @type {HTMLElement}
       */
      _container: Object,

      /**
       * Whether to force inline mode or not
       * @type {Boolean}
       */
      inline: Boolean,

      /**
       * Whether to force block mode or not
       * @type {Boolean}
       */
      block: Boolean,

      /**
       * Current scribe instance being used
       * @type {Scribe}
       */
      scribe: {
        type: Object,
        observer: '_scribeChanged'
      },

      /**
       * Whether currently editable or not. If true, text is editable, if false
       * 	text is currently read only
       * @type {Boolean}
       */
      editable: {
        type: Boolean,
        notify: true,
        value: () => Simpla.getState().editing,
        observer: '_checkPlaceholder'
      }
    };

    this.listeners = {
      'tap': '_tapHandler'
    };

    this.observers = [
      '_usePlaceholderChanged(usePlaceholder)'
    ]
  }

  ready() {
    // Bind editable to Simpla's editing state
    Simpla.observe('editing', (editing) => this.editable = editing);
  }

  /**
   * Element behaviors
   * @type {Array}
   */
  get behaviors() {
    return [].concat(
      simpla.behaviors.placeholder({
        value: 'Enter your text...'
      }),
      simpla.behaviors.blockNamespaceChild,
      scribeTarget,
      defaultBehavior,
      persists
    );
  }

  /**
   * Compute function which generates commands array from tools string
   * @param  {String} commands  Space separated string of command names
   * @return {Array}            Array of command names
   */
  _parseCommands(commands) {
    const trimmed = commands ? commands.trim() : '';
    return trimmed === '' ? null : trimmed.split(/\s+/);
  }


  /**
   * Observer for value property. Checks if the placeholder should be used
   * @return {undefined}
   */
  _valueChanged() {
    this._checkPlaceholder();
  }

  /**
   * Disables using the placeholder. Simply sets usePlaceholder to false
   * @return {undefined}
   */
  _disablePlaceholder() {
    this.usePlaceholder = false;
  }

  /**
   * Checks if the current value is empty i.e. if it's equivalent to an empty
   * 	text string
   * @return {Boolean} True is value is empty, false otherwise
   */
  _isEmpty() {
    let dummy = document.createElement('div');
    dummy.innerHTML = this.value;

    return dummy.textContent === '';
  }

  /**
   * Check if placeholder should be used or not, and sets usePlaceholder
   * 	accordingly.
   * @return {undefined}
   */
  _checkPlaceholder() {
    // Placeholder should only be used if in edit mode and value is empty
    if (this._isEmpty() && this.editable) {
      this.usePlaceholder = true;
    } else {
      this.usePlaceholder = false;
    }
  }
  /**
   * Set min-width of text element to width of placeholder when in edit mode
   * @param  {Boolean} usePlaceholder Set or unset min-width of text element
   * @return {undefined}
   */
  _usePlaceholderChanged(usePlaceholder) {
    let placeholderWidth = this.$.placeholder.getBoundingClientRect().width;

    if (!this.__minWidth) {
      this.__minWidth = getComputedStyle(this).minWidth;
    }

    if (this.__minWidth && this.__minWidth === '0px') {
      this.style.minWidth = usePlaceholder ? `${placeholderWidth}px` : '';
    }
  }

  /**
   * Handle tap events. If this is currently editable, focuses on the scribe
   * 	element
   * @return {undefined}
   */
  _tapHandler() {
    this.editable && this.$.scribe.focus();
  }

  /**
   * Observer for scribe property, updates the current inline / block
   *  attributes and updates the size of the placeholder if inline
   * @param  {Scribe} scribe Instance of scribe to check against
   * @return {undefined}
   */
  _scribeChanged(scribe) {
    const inline = !scribe.options.allowBlockElements;

    this.toggleAttribute('inline', inline);
    this.toggleAttribute('block', !inline);
  }

  /**
   * Called on attached, set _container to parent element
   * @return {undefined}
   */
  attached() {
    this._container = this.parentElement;
  }


}

Polymer(SimplaText);
