import { baseKeymap as base } from 'prosemirror-commands';
import { insertBr, bold, italic, underline } from './commands';

export function makeRichtextMaps({ schema }) {
  return {
    'Mod-b': bold({ schema }),
    'Mod-i': italic({ schema }),
    'Mod-u': underline({ schema })
  };
}

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
