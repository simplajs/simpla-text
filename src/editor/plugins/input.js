import { Plugin, PluginKey } from 'prosemirror-state';

export default function getInputPlugin({ callback }) {
  return new Plugin({
    key: new PluginKey('input'),
    state: {
      init: () => {},
      apply: (tr) => {
        if (tr.docChanged) {
          // Run callback in microtask queue so that the current transaction
          //  has been applied, if done immediately then view won't have updated
          //  yet
          Promise.resolve().then(callback);
        }
      }
    }
  });
}
