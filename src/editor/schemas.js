import { Schema } from 'prosemirror-model';
import { paragraph, text, hardBreak, blockDoc, inlineDoc } from './nodes';
import { em, strong, u } from './marks';

export const plaintextBlock = new Schema({
  nodes: { doc: blockDoc, paragraph, text, hardBreak },
  marks: {}
});

export const plaintextInline = new Schema({
  nodes: { doc: inlineDoc, text, hardBreak },
  marks: {}
});

export const richtextBlock = new Schema({
  nodes: { doc: blockDoc, paragraph, text, hardBreak },
  marks: { em, strong, u }
});

export const richtextInline = new Schema({
  nodes: { doc: inlineDoc, text, hardBreak },
  marks: { em, strong, u }
});

export default function getSchemaFor(editor) {
  if (editor.plaintext) {
    return editor.inline ? plaintextInline : plaintextBlock;
  }

  return editor.inline ? richtextInline : richtextBlock;
}
