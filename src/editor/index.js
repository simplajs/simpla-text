import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { DOMParser } from 'prosemirror-model';
import { getHistoryPlugin, getInputPlugin, getKeymapPlugin, getSelectPlugin, getFormatterStatePlugin, getFormatterKeymapPlugin } from './plugins';
import getSchema from './schemas';

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
        hasKeyCommand,
        toStatePlugin,
        toKeymapPlugin,
        getSelection,
        plugins,
        schema,
        state,
        doc;

    getSelection = () => this.view.root.getSelection();

    hasKeyCommand = (formatter) => !!formatter.keyCommand;

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
      getSelectPlugin({ callback: selectCallback, getSelection }),
      getKeymapPlugin({ inline, schema }),
      getHistoryPlugin(),
      ...formatters.map(toStatePlugin),
      ...formatters.filter(hasKeyCommand).map(toKeymapPlugin)
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

  runCommand(commandName, options = {}) {
    let command = this.commands[commandName];

    if (!command) {
      throw new Error(`Command ${commandName} not found.`);
    }

    return command(options)(this.state, this.view.dispatch);
  }
}
