import { Plugin } from 'prosemirror-state';
import { keymap as makeKeymapPlugin } from 'prosemirror-keymap';
import { makeRichtextMaps, makeInlineMaps, makeBlockMaps, base as baseKeymap } from './keymaps';

export function getKeymapPluginFor({ editor }) {
  let { plaintext, inline } = editor,
      schema = editor._getSchema(),
      mappings;

  mappings = Object.assign(
    {},
    baseKeymap,
    plaintext ? {} : makeRichtextMaps({ schema }),
    inline ? makeInlineMaps({ schema }) : makeBlockMaps({ schema })
  );

  return makeKeymapPlugin(mappings);
}

export function getInputPluginFor({ editor }) {
  return new Plugin({
    state: {
      init: () => {},
      apply: (tr) => {
        if (tr.docChanged) {
          editor.dom.fire('input');
        }
      }
    }
  });
}

export function getSelectPluginFor({ editor }) {
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
          editor.dom.fire('select', { selection: nativeSelection });
        }

        return selection;
      }
    }
  })
}
