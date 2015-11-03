import Scribe from 'scribe-editor';
import { INLINE_ELEMENTS } from './constants';

class SmHelperScribe {
  beforeRegister() {
    this.is = 'sm-text-scribe';

    this.properties = {
      value: {
        type: String,
        value: '',
        observer: '_valueChanged',
        notify: true
      },
      commands: Array,
      inline: Boolean,
      block: Boolean,
      readonly: Boolean,
      placeholder: String,
      container: Object,
      target: {
        type: Object,
        observer: '_targetChanged'
      },
      toolbar: Object,
      scribe: {
        type: Object,
        notify: true
      }
    };

    this.observers = [
      '_linkScribeWithToolbar(scribe, toolbar)',
      '_bootScribe(target, container)',
      '_commandsReady(commands, scribe)'
    ];
  }

  get behaviors() {
    return [
      simpla.behaviors.editable({
        observer: '_editableChanged'
      })
    ];
  }

  parseCommands(commands) {
    return commands.trim().split(/\s+/);
  }

  /**
   * Returns true if inline
   * @return {boolean}
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

    parent = this.container;
    name = parent.nodeName.toLowerCase();
    shouldBeInline = INLINE_ELEMENTS.indexOf(name) !== -1;

    return shouldBeInline;
  }

  focus(...args) {
    this.scribe.el.focus(...args);
  }

  get _scribe() {
    // This is for backwards compatibility and will be deprecated in future
    return this.scribe;
  }

  _fireFocus() {
    this.fire('focus');
  }

  _fireBlur() {
    this.fire('blur');
  }

  _setupScribe(target) {
    const inline = this.shouldInline();

    let scribe = new Scribe(target, {
      allowBlockElements: !inline
    });

    scribe.on('content-changed', () => {
      // Use getHTML instead of getContent so as not to apply 'for export'
      //  formatting. See https://github.com/guardian/scribe/blob/master/src/scribe.js#L147
      this.value = scribe.getHTML();
    });

    scribe.el.addEventListener('focus', () => {
      // Temporary to stop bug where returns keep getting input,
      //  and cursor returns to start
      if (scribe.getHTML().indexOf('<content></content>') !== -1 && !inline) {
        scribe.setHTML('<p></p>');
      }
    });

    // Make sure the contenteditable attribute is reset as it may have been
    //  override by scribe during setup
    this.toggleAttribute('contenteditable', this.editable, target);

    // Initialise content
    scribe.setHTML(this.value || (inline ? '' : '<p></p>'));

    return scribe;
  }

  _valueChanged(value) {
    // Note we use setHTML as setContent will trigger a content-changed event
    //  which will set off an infinite loop
    if (this.scribe && this.scribe.setHTML) {
      this.scribe.setHTML(value);
    }
  }

  _commandsReady(commands) {
    this.scribe._smEnabled = commands;
  }

  _linkScribeWithToolbar(scribe, toolbar) {
    toolbar.use(scribe);
  }

  _bootScribe(target) {
    this.scribe = this._setupScribe(target);
  }

  _targetChanged(target) {
    target.addEventListener('focus', this._fireFocus.bind(this));
    target.addEventListener('blur', this._fireBlur.bind(this));
  }

  _editableChanged(editable) {
    if (this.target) {
      this.toggleAttribute('contentEditable', editable, this.target);
    }
  }
}

Polymer(SmHelperScribe);
