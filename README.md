# nativescript-dynamic-label

[![Build Status][build-status]][build-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![TotalDownloads][total-downloads-image]][npm-url]
[![Twitter Follow][twitter-image]][twitter-url]

[build-status]:https://travis-ci.org/tremho/nativescript-dynamic-label.svg?branch=develop
[build-url]:https://travis-ci.org/tremho/nativescript-dynamic-label
[npm-image]:http://img.shields.io/npm/v/nativescript-dynamic-label.svg
[npm-url]:https://npmjs.org/package/nativescript-dynamic-label
[downloads-image]:http://img.shields.io/npm/dm/nativescript-dynamic-label.svg
[total-downloads-image]:http://img.shields.io/npm/dt/nativescript-dynamic-label.svg?label=total%20downloads
[twitter-image]:https://img.shields.io/twitter/follow/Tremho1.svg?style=social&label=Follow%20me
[twitter-url]:https://twitter.com/Tremho1

## Features
- Text Measurement
- Text Fitting
- Label control that dynamically sizes text to fit
- Android and iOS

## Installation

To get started, install the plugin, per normal methods:

```shell
tns plugin add nativescript-dynamic-label
```

## Usage 

Generally, `DynamicLabel` can be used in either
XML markup or in code much the same way as a normal `Label`
control.

#### Use via XML markup
Use pretty much the same as a regular `Label`.

###### Import the plugin into the namespace
In your page declaration, include a reference to the
`DynamicLabel` module, like this:

```xml
<Page xmlns="http://schemas.nativescript.org/tns.xsd" navigatingTo="navigatingTo"
      xmlns:dl="nativescript-dynamic-label"
      class="page"
```

the `xmlns:dl="nativescript-dynamic-label"` is the part you want
to add, and it sets the namespace `dl` as relating to the `DynamicLabel` module.

Then, invoke a `DynamicLabel` within your markup like so..

```xml
<StackLayout> <!-- or whatever layout container you are using... -->
    <dl:DynamicLabel text="Hello, World!"></dl:DynamicLabel>
</StackLayout>
```
You can use all the properties of `<Label>` for the dynamic label
also.  The most relevant of these being `width` and `textWrap`. 
Note that these properties can also be set via CSS.

#### Use via code

You may create and use a `DynamicLabel` in the same ways as
a normal `Label`.  
You may create one with `new DynamicLabel()` or
retrieve an existing one from the page with
`page.getViewById('your-D-Label-ID`)
from there, set or get the properties you would of a normal
label, e.g. dlabel.text = 'Hello, World'.
Do not set a font size to the dynamic label for display, as it
will find its own.  The text fitting is triggered on any
new text change.

Like the normal NativeScript `<Label>` and other Nativescript controls,
text may be set via the `Observable` class and changes made to 
the bound Observable property.


###### Using to measure text
To use this class to measure text, but not necessarily display it, 
you can call the `getTextExtent` method of the class.
To use this, first set a font size to the control, and then
pass the maximum width and height you are attempting to
fit text for to `getTextExtent`, and it will return the bounds of the
text, as well as an indication of whether or not the text will
fit in this space without being truncated, and also the text
per-line as determined by the internal layout algorithm.

Note that the line layout may not necessarily match what will be displayed
by the actual control, since each platform handles its word wrapping
and fitting in subtle but often significantly different ways.  
However, it should be reasonably representative of what likely
would display if set to the control at this font size (assuming
text wrap is enabled).  This information may be more useful for any
do-it-yourself layout tasks than for actual representation of what the
control renders.

```javascript

let computedWidth, computedHeight;
let maxWidth = 100; // constrain to this width
let maxHeight = 1000; // let it find the height < this
let myDLabel = page.getViewById('myDLabel');
myDLabel.fontSize = 20; // let's compute for this font size
let bounds = myDLabel.getTextExtent(myText, maxWidth, maxHeight);
if(bounds.wasCut) {
    console.error("Text doesn't fit in these bounds at this size!")
} else {
    computedWidth = bounds.width;
    computedHeight = bounds.height;
}
// computed width,height can now inform how big to make
// a display that can hold this text at this size.

// Additional information we get from this about the 
// text per lines (according to internal layout) can be
// retrieved like this:
for (let i = 0; i< bounds.lines.length; i++) {
    let t = bounds.lines[i].text;
    // let y = bounds.lines[i].top; // if we wanted to draw it
    console.log(t)
}

```
  	

## API

`DynamicLabel` inherits from [`Label`](https://docs.nativescript.org/api-reference/classes/_ui_label_.label)  and so has all of the
characteristics of that class.  

Properties specifically important to DynamicLabel are listed here.
    
| Property | Default | Description |
| --- | --- | --- |
| `textWrap` | inherits from Label | turn this on to wrap text.  Changes the choices made by the text measurer / formatter. |
| `width` | inherits from Label | must be set (direct or CSS) for sizing to be effective |
    
 
 ##### public `getTextExtent`(
           text : string, 
           textSize: number, 
           maxWidth : number, 
           maxHeight: number) : FitResults`
 
 Use to measure text as it will appear in the current typeface
 in the given font size (`textSize`) constrained to the bounds
 (`maxWidth`, `maxHeight`).  The returned `FitResults` 
 object looks like this:
 
 ```typescript
 {  
    width: number,  // width of text extent bounds
    height: number, // height of text extent bounds
    lines: LineInfo[], // array of line info, see below
    wasCut: boolean // true if text was truncated at this size
  }
```

each entry in the `lines` property above will be an object
in this format (`LineInfo`):

```typescript
 {  
  text: string, // text that appears on this line
  top: number // y offset to start drawing text
  }
```

 ##### public `fitText`() : void
            
 may be called explicitly to force a recompute/redisplay of text.
 Normally not needed, as this is called after any text or layout changes to the DynamicLabel control.

## Tips and Caveats

###### Multiline displays
If the property `textWrap` is false (the default), a font size
will be picked that allows all of the text to appear in one 
line according to the width of the control, regardless of the 
control height.
If `textWrap` is true, the control is enabled for wrapping. This
is done according to the algorithms of the underlying platform
as has been implemented for `Label`.  
To assist its predictions, `DynamicLabel` computes the word breaks
and line spans itself and uses these for measurement.

A paradox of the multiline scenario is that the fitter is working to find
measurements that fit first in width, and selecting a smaller font if
this is not acheived, but with multiline text, the new font size may change
the layout and collapse to fewer lines -- which creates a wider width
rather than a smaller one, and so the tendency is to result in
a smaller font choice than one might be able to manually choose.

You can avoid this if you have text that you already know is
multiline, and placing hard breaks (`\n`) in the string to force
a specific layout. You still must set 'textWrap=true' to allow this to 
display multiple lines, but it should honor your layout and find a size that
is reasonable for your control size.    

## Known Issues

###### Still early in development!
As of  2/14/2020 this is the first version released for testing.

As issues arise, they will be recorded in this space.

###### Version 1.0.0 
- crash found when instantiating control in certain containers
- sizing computed with incorrect scaling  

_Problems above fixed with release 1.0.1_

## Source code and Contributing

The source for this package is maintained on GitHub at:
https://github.com/tremho/nativescript-dynamic-label

Structure of the project is based on the templates generated
with the [Nativescript Plugin Seed](https://docs.nativescript.org/plugins/building-plugins#the-nativescript-plugin-seed) project.

Comments and contributions welcome!
Please submit your Pull Requests, with as much explanation and examples you can provide to 
support your changes.

Feel free to email me at `steve@ohmert.com` to start
a discussion for other suggestions.
 
    
## License

Apache License Version 2.0, January 2004
