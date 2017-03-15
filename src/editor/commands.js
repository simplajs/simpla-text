import { chainCommands, exitCode, toggleMark } from 'prosemirror-commands'

export { toggleMark };

export function addMark(markType, attrs) {
  return (state, dispatch) => {
    let { empty, from, to } = state.selection,
        hasMark = () => state.doc.rangeHasMark(from, to, markType);

    if (empty || hasMark()) {
      return false;
    }

    if (dispatch) {
      let mark = markType.create(attrs),
          transaction = state.tr.addMark(from, to, mark).scrollIntoView();

      dispatch(transaction);
    }

    return true;
  }
}

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
