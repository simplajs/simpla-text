import { Plugin } from 'prosemirror-state';
import { keymap as makeKeymapPlugin } from 'prosemirror-keymap';
import { makeRichtextMaps, makeInlineMaps, makeBlockMaps, base as baseKeymap } from './keymaps';

export function getKeymapPlugin({ plaintext, inline, schema }) {
  let mappings;

  if (!schema) {
    throw new Error('Editor must have schema for keymap');
  }

  mappings = Object.assign(
    {},
    baseKeymap,
    plaintext ? {} : makeRichtextMaps({ schema }),
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
