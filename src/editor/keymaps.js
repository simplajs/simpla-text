import { baseKeymap as base } from 'prosemirror-commands';
import { insertBr } from './commands';

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

export { base };
