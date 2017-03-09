import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { DOMParser } from 'prosemirror-model';
import { getKeymapPluginFor, getSimplaPluginFor } from './plugins';
import getSchemaFor from './schemas';

export default class Editor {
  constructor(dom, { plaintext, inline, editable }) {
    this._plaintext = plaintext;
    this._inline = inline;
    this._editable = editable;

    this.dom = dom;

    this._view = new EditorView({ mount: dom }, {
      state: this._getState(),
      editable: () => this.editable
    });
  }

  static fromElement(element) {
    let { plaintext, inline, editable } = element;

    return new Editor(element, { plaintext, inline, editable });
  }

  /**
   * Getters / setters
   */

  set inline(value) {
    this._inline = value;
    this.refresh();
  }

  get inline() {
    return this._inline;
  }

  set plaintext(value) {
    this._plaintext = value;
    this.refresh();
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

  /**
   * Public instance methods
   */

  refresh() {
    this._
    this._view.updateState(this._getState());
  }

  /**
   * Private instance methods
   */

  _getSchema() {
    return getSchemaFor(this);
  }

  _getPlugins() {
    return [
      getSimplaPluginFor(this),
      getKeymapPluginFor(this)
    ];
  }

  _getState() {
    let schema = this._getSchema(),
        plugins = this._getPlugins();

    return EditorState.create({
      doc: DOMParser.fromSchema(schema).parse(this.dom),
      schema,
      plugins
    });
  }
}
