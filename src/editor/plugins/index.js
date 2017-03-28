import getPlaceholderPlugin from './placeholder';
import getInputPlugin from './input';
import getKeymapPlugin from './keymap';
import getSelectPlugin from './select';
import { getFormatterStatePlugin, getFormatterKeymapPlugin } from './formatter';
import { history } from 'prosemirror-history';

export {
  getPlaceholderPlugin,
  getInputPlugin,
  getKeymapPlugin,
  getSelectPlugin,
  getFormatterStatePlugin,
  getFormatterKeymapPlugin
}

export { history as getHistoryPlugin }
