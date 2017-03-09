import { nodes } from 'prosemirror-schema-basic'

const blockDoc = { content: 'block+' },
      inlineDoc = { content: 'inline<_>*' },
      { paragraph, text, hard_break: hardBreak } = nodes;

export { paragraph, text, hardBreak, inlineDoc, blockDoc };
