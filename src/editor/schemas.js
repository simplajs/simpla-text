import { Schema } from 'prosemirror-model';
import { paragraph, text, hardBreak, blockDoc, inlineDoc } from './nodes';

export default function getSchemaFor({ inline, formatters }) {
  let nodes,
      marks;

  if (inline) {
    nodes = { doc: inlineDoc, text, hardBreak };
  } else {
    nodes = { doc: blockDoc, paragraph, text, hardBreak };
  }

  marks = formatters.reduce((marks, { name, specification }) => {
    return Object.assign({}, marks, { [ name ]: specification });
  }, {});

  return new Schema({ nodes, marks });
}
