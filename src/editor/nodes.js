import { nodes } from 'prosemirror-schema-basic'

const blockDoc = { content: 'block+' },
      inlineDoc = { content: 'inline<_>*' },
      { paragraph, hard_break: hardBreak } = nodes,
      text = { group: 'inline', toDOM: (node) => node.text };

export { paragraph, text, hardBreak, inlineDoc, blockDoc };
