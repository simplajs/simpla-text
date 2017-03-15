import { toggleMark, addMark } from './commands'
import { strong, u, em } from './marks';

function makeBasicFormatter({ name, specification, keyCommand }) {
  return {
    name,
    specification,
    keyCommand,

    getCommand({ schema }) {
      return toggleMark(schema.marks[name]);
    },

    getState(state) {
      return {
        applied: !addMark(state.schema.marks[name])(state),
        meta: null
      };
    },

    areEqual(a, b) {
      return a.applied === b.applied && a.meta === b.meta;
    }
  }
}

export const bold = makeBasicFormatter({
  name: 'bold',
  specification: strong,
  keyCommand: 'Mod-b'
});

export const italic = makeBasicFormatter({
  name: 'italic',
  specification: em,
  keyCommand: 'Mod-i'
});

export const underline = makeBasicFormatter({
  name: 'underline',
  specification: u,
  keyCommand: 'Mod-u'
});
