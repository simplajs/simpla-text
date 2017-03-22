import { Plugin } from 'prosemirror-state';
import { keymap as makeKeymapPlugin } from 'prosemirror-keymap';
import { makeInlineMaps, makeBlockMaps, historyKeymap, base as baseKeymap } from './keymaps';
import { history } from 'prosemirror-history';

export function getKeymapPlugin({ inline, schema }) {
  let mappings;

  if (!schema) {
    throw new Error('Editor must have schema for keymap');
  }

  mappings = Object.assign(
    {},
    baseKeymap,
    historyKeymap,
    inline ? makeInlineMaps({ schema }) : makeBlockMaps({ schema })
  );

  return makeKeymapPlugin(mappings);
}

export function getInputPlugin({ callback }) {
  return new Plugin({
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

export function getSelectPlugin({ callback, getSelection }) {
  return new Plugin({
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

export function getFormatterStatePlugin({ callback, formatter }) {
  return new Plugin({
    state: {
      init: (config, docState) => {
        let state = formatter.getState(docState);

        callback(formatter, state);

        return state;
      },

      apply: (tr, currentState, oldDocState, newDocState) => {
        let state = formatter.getState(newDocState);

        if (!formatter.areEqual(currentState, state)) {
          callback(formatter, state);
          return state;
        }

        return currentState;
      }
    }
  })
}

export function getFormatterKeymapPlugin({ schema, formatter }) {
  return makeKeymapPlugin({
    [formatter.keyCommand]: formatter.getCommand({ schema })()
  });
}

export function getPlaceholderPlugin({ placeholder }) {
  const REMOVED_PLACEHOLDER = false,
        APPLIED_PLACEHOLDER = true;

  return new Plugin({
    props: {
      onFocus(view) {
        let { showingPlaceholder } = this.getState(view.state);

        if (showingPlaceholder) {
          view.dispatch(
            view.state.tr
              .delete(0, view.state.doc.content.size)
              .setMeta(this, REMOVED_PLACEHOLDER)
          );
        }
      },

      onBlur(view) {
        let { shouldShowPlaceholder } = this.getState(view.state);

        if (shouldShowPlaceholder) {
          view.dispatch(
            view.state.tr
              .insertText(placeholder)
              .setMeta(this, APPLIED_PLACEHOLDER)
          );
        }
      }
    },

    state: {
      init(config, state) {
        return {
          shouldShowPlaceholder: state.doc.textContent === '',
          showingPlaceholder: false
        };
      },
      apply(tr, pluginState, oldState, newState) {
        let hasMeta = typeof tr.getMeta(this) !== 'undefined';

        return {
          shouldShowPlaceholder: newState.doc.textContent === '',
          showingPlaceholder: hasMeta ? tr.getMeta(this) : pluginState.showingPlaceholder
        };
      }
    }
  })
}

export { history as getHistoryPlugin }
