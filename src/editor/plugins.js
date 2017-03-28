import { TextSelection, Plugin, PluginKey } from 'prosemirror-state';
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
  const CLASS_NAME = 'simpla-text-placeholder',
        STYLE_CLASS_NAME = 'simpla-text-placeholder-styles',
        ATTRIBUTE_NAME = 'data-placeholder',
        STYLE_RULES = `
.${CLASS_NAME} {
  display: inline-block;
  cursor: text;
}
.${CLASS_NAME}::before {
  content: attr(${ATTRIBUTE_NAME});
  opacity: 0.5;
}`;

  let pluginKey = new PluginKey('placeholder'),
      stateHasChildren = (state) => state.doc.childCount > 0,
      getFirstNodeSpace = (state) => stateHasChildren(state) ? 1 : 0;

  function handleViewChange(view) {
    let { viewIsEditable } = pluginKey.getState(view.state),
        hasPlaceholderStyles = !!view.root.querySelector(`.${STYLE_CLASS_NAME}`);

    if (viewIsEditable !== view.editable) {
      view.dispatch(view.state.tr.setMeta(pluginKey, {
        viewIsEditable: view.editable,
        hasPlaceholderStyles
      }));
    }
  }

  function createPlaceholderNode(text) {
    let placeholder = document.createElement('span');

    placeholder.className = CLASS_NAME;
    placeholder.setAttribute(ATTRIBUTE_NAME, text);

    return placeholder;
  }

  function createStylingNode() {
    let style = document.createElement('style');
    style.innerHTML = STYLE_RULES;
    style.className = STYLE_CLASS_NAME;
    return style;
  }

  function shouldBeShowingPlaceholder(state) {
    let doc = state.doc,
        noChildren = !stateHasChildren(state),
        justAnEmptyChild = doc.childCount === 1
          && doc.firstChild.isTextblock
          && doc.firstChild.content.size === 0,
        { viewIsEditable } = pluginKey.getState(state);

    return viewIsEditable && (noChildren || justAnEmptyChild);
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
      onFocus(view) {
        if (shouldBeShowingPlaceholder(view.state)) {
          let atNode = view.state.doc.firstChild || view.state.doc,
              selection = TextSelection.create(atNode, 0);

          view.dispatch(view.state.tr.setSelection(selection));
        }
      },
      decorations(state) {
        if (shouldBeShowingPlaceholder(state)) {
          let decorations = [
            Decoration.widget(
              getFirstNodeSpace(state),
              createPlaceholderNode(text),
              { key: 'placeholder' }
            )
          ];

          if (!pluginKey.getState(state).hasPlaceholderStyles) {
            decorations.push(
              Decoration.widget(
                getFirstNodeSpace(state),
                createStylingNode(),
                { key: 'placeholder-styles' }
              )
            );
          }
          
          return DecorationSet.create(state.doc, decorations);
        }
      }
    },
    toJSON: (state) => Object.assign({}, state),
    fromJSON: (state) => Object.ssign({}, state)
  })
}

export { history as getHistoryPlugin }
