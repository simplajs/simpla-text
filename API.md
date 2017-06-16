# API reference

## Properties

Property         | Type      | Default                | Description                                                     
---------------- | --------- | ---------------------- | -----------                                                     
`path`           | `String`  | `undefined`            | Path to the element's content on Simpla's API                   
`value`          | `String`  | `''`                   | HTML string of the content in simpla-text
`placeholder`    | `String`  | `'Enter your text...'` | Placeholder to show when element is editable and has no content 
`inline`         | `Boolean` | `false`                | Whether to allow paragraphs                                     
`plaintext`      | `Boolean` | `false`                | Whether to disable formatting tools                             
`noTypographer`  | `Boolean` | `false`                | Whether to disable smart typography rules                      
`editable`       | `Boolean` | `false`                | Whether the element is editable                                 
`readonly`       | `Boolean` | `false`                | Whether the element is able to become editable                                 
`active`         | `Boolean` | `false`                | Whether the element is currently being edited                   
`loaded`         | `Boolean` | `false`                | Wether the element has loaded and rendered its content          

Properties can be set either directly with JavaScript or as attributes on the element, `camelCased` properties are serialized to `kebab-cased` attributes

```html
<simpla-text path="/text" no-typographer></simpla-text> 

<script>
  document.querySelector('simpla-text').editable = true;
</script>
```

## Schema

**Type:** `'Text'`

Data   | Type      | Description                                           
------ | --------- | -----------                                           
`text` | `String`  | HTML string of the rendered content in simpla-text

```json
{
  "path": "/text/path",
  "type": "Text",
  "data": {
    "text": "<p>Simpla text is editable richtext for the <strong>Simpla</strong> content system.</p>",
  },
  "createdAt": "2017-04-16T09:58:56.276Z",
  "updatedAt": "2017-05-09T09:25:36.835Z"
}
```

## Events

Event              | Properties       | Description                                    
------------------ | ---------------- | -----------                                    
`value-changed`    | `value{String}`  | Fired when `value` property changes 
`editable-changed` | `value{Boolean}` | Fired when `editable` property changes 
`active-changed`   | `value{Boolean}` | Fired when `active` property changes   
`loaded-changed`   | `value{Boolean}` | Fired when `loaded` property changes   