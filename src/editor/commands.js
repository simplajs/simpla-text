import { chainCommands, exitCode, toggleMark } from 'prosemirror-commands'

export { toggleMark };

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
