import { toggleMark } from './commands'
import { strong, u, em, link as linkSpec } from './marks';

const markIsApplied = (state, type) => {
  let { doc, selection } = state,
      { from, to } = selection;

  return doc.rangeHasMark(from, to, type);
}

const findMarkInRange = (node, from, to, type) => {
  let found = null;
  node.nodesBetween(from, to, ({ marks }) => {
    for ( var i = 0, k = marks.length; !found && i < k; i++) {
      if (marks[i].type === type) {
        found = [i];
      }
    }
  });
  return found;
}

function makeBasicFormatter({ name, specification, keyCommand }) {
  return {
    name,
    specification,
    keyCommand,

    getCommand({ schema }) {
      return (opts) => toggleMark(schema.marks[name], opts);
    },

    getState(state) {
      return {
        applied: markIsApplied(state, state.schema.marks[name]),
        meta: null
      };
    },

    areEqual(a, b) {
      return a.applied === b.applied && a.meta === b.meta;
    }
  }
}

export const link = Object.assign(
  makeBasicFormatter({
    name: 'link',
    specification: linkSpec
  }), {
    getState(state) {
      if (!state) {
        return { applied: false, meta: null };
      }

      let { selection, doc, schema } = state,
          mark = null;

      mark = findMarkInRange(
        doc,
        selection.from,
        selection.to,
        schema.marks[this.name]
      );

      return {
        applied: !!mark,
        meta: mark ? Object.assign({}, mark.attrs) : null
      };
    },

    areEqual(a, b) {
      let getHref = (from) => from.meta && from.meta.href;

      return a.applied === b.applied && getHref(a) === getHref(b);
    }
  }
);

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
