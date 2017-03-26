import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
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

export function getSelectPlugin({ callback, getSelection }) {
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

export function getFormatterStatePlugin({ callback, formatter }) {
  return new Plugin({
    key: new PluginKey(`${formatter.name}-formatter`),
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

export function getPlaceholderPlugin({ text }) {
  let pluginKey = new PluginKey('placeholder');

  function handleViewChange(view) {
    let { viewIsEditable } = pluginKey.getState(view.state);

    if (viewIsEditable !== view.editable) {
      view.dispatch(view.state.tr.setMeta(pluginKey, { viewIsEditable: view.editable }));
    }
  }

  function createPlaceholderNode(text) {
    const className = 'simpla-text-placeholder';
    let span = document.createElement('span');
    span.innerHTML = `
<style>
  .${className}::before {
    position: absolute;
    content: '${text}'
  };
</style>`;
    span.className = className;
    return span;
  }

  return new Plugin({
    key: pluginKey,
    view(view) {
      handleViewChange(view);
      return {
        update: handleViewChange
      };
    },
    state: {
      init: () => ({ viewIsEditable: false }),
      apply: (tr, pluginState) => tr.getMeta(pluginKey) || pluginState
    },
    props: {
      decorations(state) {
        let doc = state.doc,
            noChildren = doc.childCount === 0,
            justAnEmptyChild = doc.childCount === 1
              && doc.firstChild.isTextblock
              && doc.firstChild.content.size === 0,
            { viewIsEditable } = pluginKey.getState(state);

        if (viewIsEditable && (noChildren || justAnEmptyChild)) {
          return DecorationSet.create(doc, [
            Decoration.widget(
              noChildren ? 0 : 1,
              createPlaceholderNode(text),
              { key: 'placeholder' }
            )
          ]);
        }
      }
    },
    toJSON: (state) => Object.assign({}, state),
    fromJSON: (state) => Object.ssign({}, state)
  })
}

export { history as getHistoryPlugin }
