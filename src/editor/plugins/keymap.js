
import { makeInlineMaps, makeBlockMaps, historyKeymap, base as baseKeymap } from '../keymaps';
import { keymap as makeKeymapPlugin } from 'prosemirror-keymap';

export default function getKeymapPlugin({ inline, schema }) {
  let mappings;

  if (!schema) {
    throw new Error('Editor must have schema for keymap');
  }

  mappings = Object.assign(
    {},
    baseKeymap,
    historyKeymap,
    inline ? makeInlineMaps({ schema }) : makeBlockMaps({ schema })
  );

  return makeKeymapPlugin(mappings);
}
