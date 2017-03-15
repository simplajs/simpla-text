import { Plugin } from 'prosemirror-state';
import { keymap as makeKeymapPlugin } from 'prosemirror-keymap';
import { makeInlineMaps, makeBlockMaps, base as baseKeymap } from './keymaps';

export function getKeymapPlugin({ inline, schema }) {
  let mappings;

  if (!schema) {
    throw new Error('Editor must have schema for keymap');
  }

  mappings = Object.assign(
    {},
    baseKeymap,
    inline ? makeInlineMaps({ schema }) : makeBlockMaps({ schema })
  );

  return makeKeymapPlugin(mappings);
}

export function getInputPlugin({ dom }) {
  return new Plugin({
    state: {
      init: () => {},
      apply: (tr) => {
        if (tr.docChanged) {
          dom.fire('input');
        }
      }
    }
  });
}

export function getSelectPlugin({ dom }) {
  return new Plugin({
    state: {
      init: () => {
        return null;
      },

      apply: (tr, currentSelection, oldDocState, newDocState) => {
        let selection = newDocState.selection.empty ? null : newDocState.selection,
            nativeSelection;

        if (currentSelection !== selection) {
          nativeSelection = selection && window.getSelection();
          dom.fire('select', { selection: nativeSelection });
        }

        return selection;
      }
    }
  })
}

export function getFormatterStatePlugin({ dom, formatter }) {
  let notifyDom = (state) => {
    dom.fire('formatter-updated', {
      name: formatter.name,
      state
    });
  };

  return new Plugin({
    state: {
      init: (config, docState) => {
        let state = formatter.getState(docState);

        notifyDom(state);

        return state;
      },

      apply: (tr, currentState, oldDocState, newDocState) => {
        let state = formatter.getState(newDocState);

        if (!formatter.areEqual(currentState, state)) {
          notifyDom(state);
          return state;
        }

        return currentState;
      }
    }
  })
}

export function getFormatterKeymapPlugin({ schema, formatter }) {
  return makeKeymapPlugin({
    [formatter.keyCommand]: formatter.getCommand({ schema })
  });
}
