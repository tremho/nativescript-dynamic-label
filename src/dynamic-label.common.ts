import { Observable } from 'tns-core-modules/data/observable';
import { Label } from 'tns-core-modules/ui/label'
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout'
import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout'
import { screen }  from 'tns-core-modules/platform';
import { PercentLength } from 'tns-core-modules/ui/styling/style-properties'
import { EventData } from 'tns-core-modules/data/observable'
const scale = screen.mainScreen.scale;
import { FitResults } from "./OurTypes";

export class Common extends Label {

  constructor() {
      super()
      this.on('loaded', (eventData:EventData) => {
          console.log('dynamic label loaded');
          const lbl = eventData.object as Common;
          lbl.lineHeight = 0; // weird, but it works
          if(lbl.android) {
              console.log('setting gravity to CENTER');
              lbl.android.setGravity(17);
              lbl.fitText()
          }

      })
  }

  private findWidth() : number {
      function widthOf(view) {
          const w = view.width;
          if (typeof w === 'number') {
              return w
          } else {
              if(!view.parent) return 0;
              return widthOf(view.parent)
          }
      }
      return widthOf(this)
  }
    private findHeight() : number {
        function heightOf(view) {
            const h = view.height;
            if (typeof h === 'number') {
                return h
            } else {
                if(!view.parent) return 0;
                return heightOf(view.parent)
            }
        }
        return heightOf(this)
    }

    private findPadding(horz = false) : number {
        function propValueOf(view, prop) {
            const  v = view.get(prop);
            if (typeof v === 'number') {
                return v
            } else {
                if(!view.parent) return 0;
                return propValueOf(view.parent, prop)
            }
        }
        if(horz) {
            let l = propValueOf(this, 'paddingLeft');
            let r = propValueOf(this, 'paddingRight');
            console.log(`horizontal padding ${l} and ${r}`)
            return l + r;
        }
        let t = propValueOf(this, 'paddingTop');
        let b = propValueOf(this, 'paddingBottom');
        console.log(`vertical padding ${t} and ${b}`)
        return t + b;
    }
    private findRenderWidth() : number {
        let p = this.findPadding(true);
        return this.findWidth() - p
    }
    private findRenderHeight() : number {
        let p = this.findPadding(false);
        return this.findHeight() - p;
    }

    /*
    bottom padding may clip the text bottom a little for multi-line text
     */

  public fitText () : void {
      let text = this.text;
      if(text.indexOf('9thEntry') !== -1) {
          console.log("debug break here")
      }
      if(text.indexOf('Supercalifrag') !== -1) {
          console.log("debug break here")
      }
      let size = this.fontSize;
      let minSize = 1;
      let maxWidth = this.findRenderWidth();
      let maxHeight = this.findRenderHeight();
      let maxSize = (maxHeight - size) / 2 + size;
      console.log(`detected target bounds are ${maxWidth} x ${maxHeight}`)

      let oneLiner = !this.textWrap;

      while(true) {
          let lastSize = size;
          const bounds = this.getTextExtent(text, size, maxWidth, maxHeight);
          console.log(`resulting fit @ ${size} is ${bounds.wasCut ? 'cut' : 'not cut'} ${bounds.width}x${bounds.height}`);
          console.log(`${bounds.lines.length} lines:`);
          for( let i=0; i<bounds.lines.length; i++) {
              const t = bounds.lines[i].text;
              console.log(">>> "+t)
          }
          const nofit = bounds.wasCut || (oneLiner && bounds.lines.length > 1) || bounds.height > maxHeight;
          if(nofit) {
            if(oneLiner && bounds.wasCut) {
              // size--
            } else {
              // smaller
              maxSize = size;
              size = (size - minSize) / 2 + minSize
            }
          } else if(!bounds.wasCut) {
              // larger
              minSize = size;
              size = (maxSize - size) / 2 + minSize;
          }

          size = Math.round(Math.floor(size * 10) / 10);
          if(size === lastSize) {
              size-=2; // additional relief to insure fit of small words with no ellipsis.
              console.log(`chosen font size is ${size}`);
              this.fontSize = size;
              this.text = text;
              setTimeout(()=> {
                  const mw = this.getMeasuredWidth();
                  const mh = this.getMeasuredHeight();
                  console.log(`realized control is ${mw} x ${mh} [ ${mw/3} x ${mh/3} ]`)
                  console.log(`computed bounds is ${bounds.width} x ${bounds.height}`)
              });
              break;
          }

      }
  }

  public getTextExtent(text : string, textSize: number, maxWidth : number, maxHeight: number) : FitResults {

      console.error('this method should be overridden by platform implementation code' + text);
      const results = { width: maxWidth, height: 0, lines:[], wasCut: false };
      return results
  }

  public greet() {
    return "Hello, Dynamic Label";
  }


}




