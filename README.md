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

Generally, DynamicLabel can be used in either
XML markup or in code much the same way as a normal Label
control.

	```javascript
    Usage code snippets here
    ```)

See the demo source for more usage examples	

## API

Describe your plugin methods and properties here. See [nativescript-feedback](https://github.com/EddyVerbruggen/nativescript-feedback) for example.
    
| Property | Default | Description |
| --- | --- | --- |
| `textWrap` | inherits from Label | turn this on to wrap text.  Changes the choices made by the measuring / formatter. |
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
  left: number // left offset to start drawing text
  }
```

 ##### public `fitText`(
            `measureOnly: boolean) : RenderedSize`
            
 may be called explicitly to force a recompute/redisplay of text.
 Normally not needed, as this is called after any relevant
 property changes to the DynamicLabel control.
 
 If the parameter `measureOnly ` is passed as `true`,
 no re-rendering occurs, and only the results of
 the fit calculation are returned.
 
 The method returns the following `RenderedSize` object:
 
 ```typescript
  {  
  width: number; // width of predicted text extent bounds
  height: number; // height of predicted text extent bounds
  textSize: number; // font size selected for fit
   }
 ```

## Known Issues

###### Still in development!
As of  2/10/2020 this is the first version and is incomplete.
- iOS support not in place yet
- Propery change listeners not implmented. `fitText()` must be called explicitly beyond first layout. 
- `fitText` api described above for measure-only is not implemented.


## Contributing

Comments and contributions welcome!
Please submit your Pull Requests, with as much explanation and examples you can provide to 
support your changes.

Feel free to email me at `steve@ohmert.com` to start
a discussion for other suggestions.
 
    
## License

Apache License Version 2.0, January 2004
