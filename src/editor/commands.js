import { chainCommands, exitCode, toggleMark } from 'prosemirror-commands'

export function insertBr({ schema }) {
  return chainCommands(
    exitCode,
    (state, dispatch) => {
      dispatch(
        state.tr.replaceSelectionWith(schema.nodes.hardBreak.create())
          .scrollIntoView()
      );
      return true;
    }
  );
}

export function bold({ schema }) {
  return toggleMark(schema.marks.strong);
}

export function italic({ schema }) {
  return toggleMark(schema.marks.em);
}

export function underline({ schema }) {
  return toggleMark(schema.marks.u);
}
