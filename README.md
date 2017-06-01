# Simpla Text
[![Build status][travis-badge]][travis-url] ![Size][size-badge] ![Version][bower-badge] [![Published][webcomponents-badge]][webcomponents-url] [![Simpla slack group][slack-badge]][slack-url]

Simpla-text is a web component that contains editable richtext, built on the [Simpla](https://www.simpla.io) content system. You can update it seamlessly inline on your page, and use it on its own or inside other textual elements.

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
      html {
        font-family: sans-serif
        margin: 1rem 0;
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

## Installation and setup

Install simpla-text with Bower (Yarn support coming soon)

```sh
$ bower i simpla-text --save
```

Then include the Simpla library and setup a project (read more about [setting up Simpla](https://www.simpla.io/docs/guides/get-started))

```html
<script src="https://unpkg.com/simpla@^2.0.0"></script>
<script>
  // TODO: replace 'project-id' with your project ID
  Simpla.init('project-id')
</script>
```

Import simpla-text into the `<head>` of your document

```html
<link rel="import" href="/bower_components/simpla-text/simpla-text.html">
```

And use it anywhere you want editable text on your page. You must also specify a content path (where the element's data will be stored on Simpla's API) in a `path` attribute.

```html
<simpla-text path="/text"></simpla-text>
```

### Polyfills for cross-browser support

`simpla-text` relies on emerging standards, for full cross-browser support make sure you include the [Web Components Lite](https://github.com/webcomponents/webcomponentsjs) polyfill.

```html
<script src="https://unpkg.com/webcomponents.js@^0.7.24/webcomponents-lite.min.js"></script>
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

Entering edit mode is the recommended way to edit text. It ensures all elements on a page remain in sync and updates Simpla's public `'editable'` state, which other elements may rely on.

> If you include the [simpla-admin](https://webcomponents.org/element/SimplaElements/simpla-admin) component on your page, you can also enter edit mode by adding #edit to the end of your URL

## Saving content

Save `simpla-text` content by calling Simpla's `save` method, which will save all modified content on the page. It returns a promise.

```js
// Save all modified Simpla content
Simpla.save();
```

Note you must be authenticated before saving content - either login with `simpla-admin` or the `Simpla.login()` method.

> If you have included the [simpla-admin](http://webcomponents.org/element/SimplaElements/simpla-admin) component on your site, you can save content by entering edit mode and just pressing the 'save' button.

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

You can write HTML content inside simpla-text just like you would with any other element. If content for the text's `path` exists on Simpla's API any static content will be overwritten

```html
<simpla-text path="/text">
  <p>Some static content</p>
</simpla-text>

<h1>
  <simpla-text path="/heading">Heading content</simpla-text>
</h1>
```

Initializing with static content is useful for converting existing sites to Simpla, or bootstrapping a project with predefined content. By putting content inside `<simpla-text>` and then calling `Simpla.save()` you can easily set content directly to Simpla's API.

**Note:** Since any static content is overwritten by remote data, you should not have content inside `<simpla-text>` in production, because if newer content gets saved you will experience FOUC (Flash Of Unformatted Content) when the static content is overwritten.

## Plaintext

By default simpla-text provides editable richtext, with basic formatting controls (bold, italic, underline, links) available to the user. You can disable all formatting tools and force simpla-text to create plain text content only with the `plaintext` property.

```html
<simpla-text path="/text" plaintext></simpla-text>
```

## Custom placeholders

You can set custom placeholders (displayed when simpla-text is editable and does not have content) the same way as native elements, with a `placeholder` attribute

```html
<simpla-text path="/text" placeholder="Start typing..."></simpla-text>
```

## Typographer

By default simpla-text applies 'smart typography' rules to its content. These include:

- Smart quotes (`"` to `“`)
- Automatic em dashes (`--` to `—`)
- Automatic ellipses (`...` to `…`)

You can disable the typographer by giving simpla-text a `noTypographer` property

```html
<simpla-text path="/text" no-typographer></simpla-text>
```

## API reference

### Properties

Property         | Type    | Default                | Description                                                     
---------------- | ------- | ---------------------- | -----------                                                     
`path`           | String  | `undefined`            | Path to the element's content on Simpla's API                   
`placeholder`    | String  | `'Enter your text...'` | Placeholder to show when element is editable and has no content 
`inline`         | Boolean | `false`                | Whether to allow paragraphs                                     
`plaintext`      | Boolean | `false`                | Whether to disable formatting tools                             
`noTypographer`  | Boolean | `false`                | Whether to disable smart typography rules                      
`editable`       | Boolean | `false`                | Whether the element is editable                                 
`active`         | Boolean | `false`                | Whether the element is currently being edited                   
`loaded`         | Boolean | `false`                | Wether the element has loaded and rendered its content          

Properties can be set either directly with JavaScript or as attributes on the element, `camelCased` properties are serialized to `kebab-cased` attributes

```html
<simpla-text path="/text" plaintext no-typographer></simpla-text> 

<script>
  document.querySelector('simpla-text').editable = true;
</script>
```

### Events

Event              | Description                                    
------------------ | -----------                                    
`editable-changed` | Fired whenever the `editable` property changes 
`active-changed`   | Fired whenever the `active` property changes   
`loaded-changed`   | Fired whenever the `loaded` property changes   

## Contributing

If you find any issues with simpla-text please report them! If you'd like to see a new feature in supported file an issue or let us know in Simpla's public [Slack group](https://slack.simpla.io). We also happily accept PRs. 

***

MIT © Simpla

[bower-badge]: https://img.shields.io/bower/v/simpla-text.svg
[travis-badge]: https://img.shields.io/travis/SimplaElements/simpla-text.svg
[travis-url]: https://travis-ci.org/SimplaElements/simpla-text
[size-badge]: http://img.badgesize.io/SimplaElements/simpla-text/master/simpla-text.html?compression=gzip&label=render_bundle_%28gzip%29
[webcomponents-badge]: https://img.shields.io/badge/webcomponents.org-published-blue.svg
[webcomponents-url]: https://www.webcomponents.org/element/SimplaElements/simpla-text
[slack-badge]: http://slack.simpla.io/badge.svg
[slack-url]: https://slack.simpla.io

