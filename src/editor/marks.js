import { marks } from 'prosemirror-schema-basic';

const { em, strong, link } = marks;

const u = {
  parseDOM: [{
    tag: 'u'
  }, {
    style: 'font-style',
    getAttrs: (value) => {
      if (value === 'italic') {
        return true;
      }
    }
  }],

  toDOM: () => ['u']
};

export { em, strong, u, link };
