import './utils/contains-patch';
import Scribe from 'scribe-editor';
import { INLINE_ELEMENTS } from './constants';

class SmHelperScribe {
  beforeRegister() {
    this.is = 'sm-text-scribe';

    this.properties = {
      /**
       * HTML value of editor
       * @type {String}
       */
      value: {
        type: String,
        value: '',
        observer: '_valueChanged',
        notify: true
      },

      /**
       * Array of enabled commands to be used
       * @type {Array}
       */
      commands: Array,

      /**
       * Whether to use inline mode. If true, br elements are used in scribe
       * 	instead of paragraph elements
       * @type {Boolean}
       */
      inline: Boolean,

      /**
       * Whether to use block mode. If true, pragraph elements are used in scribe
       * 	instead of br elements
       * @type {Boolean}
       */
      block: Boolean,
      readonly: Boolean,
      placeholder: String,

      /**
       * Container of the editor element
       * @type {HTMLElement}
       */
      container: Object,

      /**
       * Element to use as target for scribe i.e. element that contenteditable
       * 	is applied to
       * @type {HTMLElement}
       */
      target: Object,

      /**
       * Toolbar instance to use
       * @type {HTMLElement}
       */
      toolbar: Object,

      /**
       * Current scribe instance being used
       * @type {Scribe}
       */
      scribe: {
        type: Object,
        notify: true
      },

      /**
       * Whether scribe instance is editable or not
       * @type {Boolean}
       */
      editable: {
        type: Boolean,
        notify: true,
        value: false,
        observer: '_editableChanged'
      }
    };

    this.observers = [
      '_linkScribeWithToolbar(scribe, toolbar)',
      '_bootScribe(target, container)',
      '_commandsReady(commands, scribe)'
    ];
  }

  /**
   * Parse given whitespace separated commands, returning array of command names
   * @param  {String} commands  Space separated list of names
   * @return {Array}            Array of command names
   */
  parseCommands(commands) {
    return commands.trim().split(/\s+/);
  }

  /**
   * Returns true if inline
   * @return {boolean}  True if it should be inline formatted, false otherwise
   */
  shouldInline() {
    let parent,
        name,
        shouldBeInline;

    if (this.inline) {
      return true;
    }

    if (this.block) {
      return false;
    }

    // Not explicitly set, so assume inline / block from the container element
    parent = this.container;
    name = parent.nodeName.toLowerCase();
    shouldBeInline = INLINE_ELEMENTS.indexOf(name) !== -1;

    return shouldBeInline;
  }

  /**
   * Focus on the current scribe element
   * @param  {...mixed} args  Arguments that are passed on to HTMLElement.focus
   * @return {undefined}
   */
  focus(...args) {
    this.scribe.el.focus(...args);
  }

  /**
   * Clear the value - sets to '' if inline, '<p></p>' otherwise
   * @return {undefined}
   */
  clear() {
    const inline = this.shouldInline();
    // Use set content so formatters are applied
    this.scribe.setContent(inline ? '' : '<p></p>');
  }

  get _scribe() {
    // This is for backwards compatibility and will be deprecated in future
    return this.scribe;
  }

  /**
   * Setup new scribe instance. Re-called whenever target changes
   * @param  {HTMLElement} target Element to apply scribe to
   * @return {Scribe}             Returns new scribe instance
   */
  _setupScribe(target) {
    const inline = this.shouldInline();

    let scribe = new Scribe(target, {
      allowBlockElements: !inline
    });

    // Update this.value to the html content of scribe everytime the content changes
    scribe.on('content-changed', () => {
      // Use getHTML instead of getContent so as not to apply 'for export'
      //  formatting. See https://github.com/guardian/scribe/blob/master/src/scribe.js#L147
      this.value = scribe.getHTML();
    });

    // Make sure the contenteditable attribute is reset as it may have been
    //  override by scribe during setup
    this.toggleAttribute('contenteditable', this.editable, target);

    // Initialise content
    if (this.value) {
      scribe.setHTML(this.value);
    } else {
      // Clear if empty value
      scribe.setContent(inline ? '' : '<p></p>');
    }

    return scribe;
  }

  /**
   * Observer for value property. Updates the HTML of the scribe instance
   *  so that the scribe HTML and this.value are bound
   * @param  {String} value HTML string of current value
   * @return {undefined}
   */
  _valueChanged(value) {
    // Note we use setHTML as setContent will trigger a content-changed event
    //  which will set off an infinite loop
    if (this.scribe && this.scribe.setHTML) {
      if (value) {
        this.scribe.setHTML(value);
      } else {
        this.clear();
      }
    }
  }

  /**
   * Observer for commands and scribe properties. Ensures that scribe is ready
   * 	before dealing with commands. Updates the enabled scribe commands to commands
   * @param  {Array} commands Array of command names to enable
   * @return {undefined}
   */
  _commandsReady(commands) {
    this.scribe._smEnabled = commands;
  }

  /**
   * Observer for scribe and toolbar properties. Links scribe instance to toolbar
   * @param  {Scribe}       scribe  Scribe instance to link to toolbar
   * @param  {HTMLElement}  toolbar Toolbar instance to link scribe to, should be
   *                                	an instance of sm-ui-toolbar
   * @return {undefined}
   */
  _linkScribeWithToolbar(scribe, toolbar) {
    toolbar.use(scribe);
  }

  /**
   * Observer for target and container property. Observes container to ensure the
   * 	container is available and scribe is rebuilt on container change. It boots
   * 	a new scribe instance for the target and sets to this.scribe
   * @param  {HTMLElement} target HTMLElement for scribe to target
   * @return {undefined}
   */
  _bootScribe(target) {
    this.scribe = this._setupScribe(target);
  }

  /**
   * Observer for editable property. Sets contentEditable on this.target
   * 	to value of editable
   * @param  {Boolean}  editable   Whether this contents is editable or not
   * @return {undefined}
   */
  _editableChanged(editable) {
    if (this.target) {
      this.toggleAttribute('contentEditable', editable, this.target);
    }
  }
}

Polymer(SmHelperScribe);
