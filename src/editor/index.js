import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { DOMParser } from 'prosemirror-model';
import { getInputPlugin, getKeymapPlugin, getSelectPlugin, getFormatterStatePlugin, getFormatterKeymapPlugin } from './plugins';
import getSchema from './schemas';
import * as formatters from './formatters';

const noop = () => {};

export default class Editor {
  constructor(options = {}) {
    let {
          dom,
          inline = false,
          formatters = [],
          editableCallback = noop,
          selectCallback = noop,
          inputCallback = noop,
          formatterChangedCallback = noop
        } = options,
        toStatePlugin,
        toKeymapPlugin,
        plugins,
        schema,
        state,
        doc;

    toStatePlugin = (formatter) => {
      return getFormatterStatePlugin({
        schema,
        formatter,
        callback: formatterChangedCallback
      });
    };

    toKeymapPlugin = (formatter) => {
      return getFormatterKeymapPlugin({ schema, formatter });
    }

    schema = getSchema({ inline, formatters });

    plugins = [
      getInputPlugin({ callback: inputCallback }),
      getSelectPlugin({ callback: selectCallback }),
      getKeymapPlugin({ inline, schema }),
      ...formatters.map(toStatePlugin),
      ...formatters.map(toKeymapPlugin)
    ];

    doc = DOMParser.fromSchema(schema).parse(dom);
    state = EditorState.create({ doc, schema, plugins })

    this._inline = inline;
    this._dom = dom;

    this._view = new EditorView({ mount: dom }, {
      editable: editableCallback,
      state
    });

    this.commands = formatters.reduce((commands, formatter) => {
      let command = formatter.getCommand({ schema });
      return Object.assign({}, commands, { [formatter.name] : command });
    }, {})
  }

  static get formatters() {
    return formatters;
  }

  /**
   * Getters / setters
   */

  get inline() {
    return this._inline;
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

  runCommand(commandName) {
    let command = this.commands[commandName];

    if (!command) {
      throw new Error(`Command ${commandName} not found.`);
    }

    return command(this.state, this.view.dispatch);
  }
}
