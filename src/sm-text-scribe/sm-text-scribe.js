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
      target: Object,
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

    // Make sure the contenteditable attribute is reset as it may have been
    //  override by scribe during setup
    this.toggleAttribute('contenteditable', this.editable, target);

    // Initialise content
    if (this.value) {
      scribe.setHTML(this.value);
    } else {
      // Use setContent so that formatters are applied
      scribe.setContent(inline ? '' : '<p></p>');
    }

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

  _editableChanged(editable) {
    if (this.target) {
      this.toggleAttribute('contentEditable', editable, this.target);
    }
  }
}

Polymer(SmHelperScribe);
