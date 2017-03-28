import { Plugin, PluginKey } from 'prosemirror-state';
import { keymap as makeKeymapPlugin } from 'prosemirror-keymap';

export function getFormatterStatePlugin({ callback, formatter }) {
  return new Plugin({
    key: new PluginKey(`${formatter.name}-formatter`),
    state: {
      init: (config, docState) => {
        let state = formatter.getState(docState);

        callback(formatter, state);

        return state;
      },

      apply: (tr, currentState, oldDocState, newDocState) => {
        let state = formatter.getState(newDocState);

        if (!formatter.areEqual(currentState, state)) {
          callback(formatter, state);
          return state;
        }

        return currentState;
      }
    }
  })
}

export function getFormatterKeymapPlugin({ schema, formatter }) {
  return makeKeymapPlugin({
    [formatter.keyCommand]: formatter.getCommand({ schema })()
  });
}
