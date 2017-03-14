import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { DOMParser } from 'prosemirror-model';
import { getInputPlugin, getKeymapPlugin, getSelectPlugin } from './plugins';
import getSchemaFor from './schemas';
import commands from './commands';

export default class Editor {
  constructor(dom, { plaintext, inline, editable }) {
    let plugins,
        schema,
        state,
        doc;

    schema = getSchemaFor({ plaintext, inline });

    plugins = [
      getInputPlugin({ dom }),
      getSelectPlugin({ dom }),
      getKeymapPlugin({ plaintext, inline, schema })
    ];

    doc = DOMParser.fromSchema(schema).parse(dom);
    state = EditorState.create({ doc, schema, plugins })

    this._plaintext = plaintext;
    this._inline = inline;
    this._editable = editable;
    this._dom = dom;

    this._view = new EditorView({ mount: dom }, {
      editable: () => this.editable,
      state
    });
  }

  static fromElement(element) {
    let { plaintext, inline, editable } = element;

    return new Editor(element, { plaintext, inline, editable });
  }

  /**
   * Getters / setters
   */

  get inline() {
    return this._inline;
  }

  get plaintext() {
    return this._plaintext;
  }

  set editable(value) {
    this._editable = value;
  }

  get editable() {
    return this._editable;
  }

  get view() {
    return this._view;
  }

  get state() {
    return this.view && this.view.state;
  }

  get schema() {
    return this.state && this.state.schema;
  }

  get dom() {
    return this._dom;
  }

  /**
   * Public instance methods
   */

  runCommand(commandName, options = {}) {
    let command = commands[commandName],
        { dry = false } = options,
        { view, state, schema } = this,
        { dispatch } = view;

    return command({ schema })(state, dry ? null : dispatch);
  }
}
