import { baseKeymap as base } from 'prosemirror-commands';
import { insertBr } from './commands';
import { undo, redo } from 'prosemirror-history';

export function makeInlineMaps({ schema }) {
  return {
    'Enter': insertBr({ schema })
  };
}

export function makeBlockMaps({ schema }) {
  return {
    'Mod-Enter': insertBr({ schema })
  };
}

export const historyKeymap = {
  'Mod-z': undo,
  'Shift-Mod-z': redo
}

export { base };
