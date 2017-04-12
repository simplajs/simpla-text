import { Plugin, PluginKey } from 'prosemirror-state';

export default function getSelectPlugin({ callback, getSelection }) {
  return new Plugin({
    key: new PluginKey('select'),
    state: {
      init: () => {
        return null;
      },

      apply: (tr, currentSelection, oldDocState, newDocState) => {
        let selection = newDocState.selection.empty ? null : newDocState.selection,
            nativeSelection;

        if (currentSelection !== selection) {
          nativeSelection = selection && getSelection();
          callback(nativeSelection);
        }

        return selection;
      }
    }
  })
}
