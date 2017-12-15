# Simpla Text
[![Build status][travis-badge]][travis-url] ![Size][size-badge] ![Version][bower-badge] [![Published][webcomponents-badge]][webcomponents-url]

Simpla-text is an element containing editable richtext, which you can update seamlessly inline on your page. Use it on its own or inside other textual elements. It's built on the [Simpla](https://www.simpla.io) content system.

<!---
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <script src="https://unpkg.com/simpla@^2.0.0"></script>
    <script>
      Simpla.init('local');
      Simpla.editable(true);
    </script>
    <link rel="import" href="simpla-text.html">
    <style>
      body {
        font-family: sans-serif;
        line-height: 1.6;
        padding: 1rem 0.5rem;
      }
    </style>
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->

```html
<simpla-text path="/text"></simpla-text>
```

### Contents

- [Installation and setup](#installation-and-setup)
- [Editing content](#editing-content)
- [Saving content](#saving-content)
- [Inline content](#inline-content)
- [Initializing with static content](#initializing-with-static-content)
- [Plaintext](#plaintext)
- [Custom placeholders](#custom-placeholders)
- [Typographer](#typographer)
- [Readonly](#readonly)
- [Contributing](#contributing)

### Resources

- [API reference][api]
- [Demo][demo]
- [License][license]

## Installation and setup

Install simpla-text with Bower (Yarn support coming soon)

```sh
$ bower i simpla-text --save
```

[Setup Simpla][simpla-setup] on your page, then import simpla-text into your `<head>`

```html
<link rel="import" href="/bower_components/simpla-text/simpla-text.html">
```

Use `<simpla-text>` wherever you want editable text on your page. Give each text element a unique `path`, where it will store its content in your project

```html
<simpla-text path="/text"></simpla-text>
```

## Editing content

Edit text by entering edit mode with Simpla, or setting the `editable` property directly on an element.

```js
// Enter edit mode
Simpla.editable(true);
```

```html
<!-- Make only this text editable -->
<simpla-text path="/text" editable></simpla-text>
```

Entering edit mode is the recommended way to edit text. It ensures all elements on a page remain in sync and updates Simpla's public `editable` state, which other elements may rely on.

## Saving content

Save simpla-text content by calling Simpla's `save()` method, which will save all modified content on the page. It returns a promise.

```js
// Save all modified Simpla content
Simpla.save();
```

> You must be authenticated with Simpla before saving content

## Inline content

You can use `<simpla-text>` either as a standalone text container, or inside other textual elements (headings, paragraphs, etc). When used inside other textual elements, simpla-text automatically enables `inline` mode, which disables paragraphs and inserts line breaks for new lines.

```html
<!-- Standalone text container, uses paragraphs -->
<simpla-text path="/text"></simpla-text>

<!-- Inline content, line breaks only -->
<h1>
  <simpla-text path="/text"></simpla-text>
</h1>
```

You can also force `inline` mode by setting the `inline` property on simpla-text

```html
<!-- Inline content, line breaks only -->
<simpla-text path="/text" inline></simpla-text>
```

## Initializing with static content

You can write HTML content inside simpla-text just like you would with any other element. The HTML you insert will be parsed into simpla-text's content model when you enter edit mode. If content for a text's `path` exists on Simpla's API any static content will be overwritten.

```html
<simpla-text path="/text">
  <p>Simpla text is a block of editable richtext for the Simpla content system</p>
</simpla-text>
```

Initializing with static content is useful for converting existing sites to Simpla, or bootstrapping a project with predefined content. By putting content inside `<simpla-text>` and then calling `Simpla.save()` you can easily set content directly to Simpla's API.

> Since static content is overwritten by remote data, you should not have content inside `<simpla-text>` in production. If newer content gets saved you will experience FOUC (Flash Of Unformatted Content) when the static content is overwritten

## Plaintext

By default simpla-text provides editable richtext, with basic formatting controls (bold, italic, underline, links) available to the user. You can disable all formatting tools and force simpla-text to create plain text content only with the `plaintext` property.

```html
<simpla-text path="/text" plaintext></simpla-text>
```

## Custom placeholders

You can set custom placeholders (displayed when simpla-text is editable and doesn't have content) with a `placeholder` attribute

```html
<simpla-text 
  path="/text" 
  placeholder="Start typing...">
</simpla-text>
```

## Typographer

Simpla-text applies 'smart typography' rules to its content, including:

- Smart quotes (`"` to `“`)
- Automatic em dashes (`--` to `—`)
- Automatic ellipses (`...` to `…`)

You can disable the typographer by giving simpla-text a `noTypographer` property

```html
<simpla-text path="/text" no-typographer></simpla-text>
```

## Readonly

Simpla-text has a `readonly` property that stops the element from becoming editable, even if Simpla is in edit mode or you try to set `editable` on the element directly. This is useful for using simpla-text to purely consume and display content from Simpla's API.

```html
<simpla-text path="/text" readonly></simpla-text>
```

## Contributing

If you find any issues with simpla-text please report them! If you'd like to see a new feature in supported file an issue. We also happily accept PRs. 

***

MIT © [Simpla][simpla]

[simpla]: https://www.simpla.io
[simpla-setup]: https://docs.simpla.io/guides/get-started.html

[api]: https://www.webcomponents.org/element/simplaio/simpla-text/page/API.md
[demo]: https://www.webcomponents.org/element/simplaio/simpla-text/demo/demo/index.html
[license]: https://github.com/simplaio/simpla-text/blob/master/LICENSE

[bower-badge]: https://img.shields.io/bower/v/simpla-text.svg
[travis-badge]: https://img.shields.io/travis/simplaio/simpla-text.svg
[travis-url]: https://travis-ci.org/simplaio/simpla-text
[size-badge]: http://img.badgesize.io/simplaio/simpla-text/master/simpla-text.html?compression=gzip&label=render_bundle_%28gzip%29
[webcomponents-badge]: https://img.shields.io/badge/webcomponents.org-published-blue.svg
[webcomponents-url]: https://www.webcomponents.org/element/simplaio/simpla-text

