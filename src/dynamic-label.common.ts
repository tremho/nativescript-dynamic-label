import { Label } from 'tns-core-modules/ui/label';
import { EventData } from 'tns-core-modules/data/observable';
import { FitResults } from "./local-types.d";
import { screen } from 'tns-core-modules/platform';
const scale = screen.mainScreen.scale;

export class Common extends Label {

  private _isLoaded: boolean;

  constructor() {
      super();
      this.on('loaded', (eventData: EventData) => {
          const lbl = eventData.object as Common;
          this._isLoaded = true;
          lbl.lineHeight = 0; // weird, but it works (sort of)
          if (lbl.android) {
              lbl.android.setGravity(17);
              lbl.fitText();
          }
      });
      this.on('textChange', (eventData: EventData) => {
          const lbl = eventData.object as Common;
          if (this._isLoaded) {
            lbl.fitText();
          }
      });
  }


  private findWidth(): number {
      function widthOf (view) {
          const mw = view.getMeasuredWidth() / scale;
          const w = mw || view.width;
          if (typeof w === 'number') {
              return w;
          } else {
              if (!view.parent) return 0;
              return widthOf(view.parent);
          }
      }
      return widthOf(this);
  }
    private findHeight(): number {
        function heightOf(view) {
            const mh = view.getMeasuredHeight() / scale;
            const h = mh || view.height;
            if (typeof h === 'number') {
                return h;
            } else {
                if (!view.parent) return 0;
                return heightOf(view.parent);
            }
        }
        return heightOf(this);



    }

    private findPadding(horz = false): number {
        function propValueOf(view, prop) {
            const  v = view.get(prop);
            if (typeof v === 'number') {
                return v;
            } else {
                if (!view.parent) return 0;
                return propValueOf(view.parent, prop);
            }
        }
        if (horz) {
            let l = propValueOf(this, 'paddingLeft');
            let r = propValueOf(this, 'paddingRight');
            console.log(`horizontal padding ${l} and ${r}`);
            return l + r;
        }
        let t = propValueOf(this, 'paddingTop');
        let b = propValueOf(this, 'paddingBottom');
        console.log(`vertical padding ${t} and ${b}`);
        return t + b;
    }
    public findRenderWidth(): number {
        let p = this.findPadding(true);
        return this.findWidth() - p;
    }
    public findRenderHeight(): number {
        let p = this.findPadding(false);
        return this.findHeight() - p;
    }

    /*
    bottom padding may clip the text bottom a little for multi-line text
     */

  public fitText (): void {
      console.log(`\\/------------------------ ${this.id} -------------------\\/`);
      console.log(`control id ${this.id} : ${this.width} x ${this.height}`);
      let text = this.text;
      if (text === 'Seattle, WA') {
          if (this.id === 'dl2w') {
            console.log('debug break here');
          }
      }
      if (text.indexOf('9thEntry') !== -1) {
          console.log("debug break here");
      }
      if (text.indexOf('Supercalifrag') !== -1) {
          console.log("debug break here");
      }
      let size = this.fontSize;
      let minSize = 1;
      let maxWidth = this.findRenderWidth();
      let maxHeight = this.findRenderHeight();
      let maxSize = (maxHeight - size) / 2 + size;
      this.fontSize = maxSize;
      size = maxSize;
      console.log(`detected target bounds are ${maxWidth} x ${maxHeight}`);

      let oneLiner = !this.textWrap;
      let wasMultiAt = 0
      while (true) {
          let lastSize = size;
          this.fontSize = size;
          const bounds = this.getTextExtent(text, size, maxWidth, maxHeight);
          console.log(`${this.id} test fit @ ${size} is ${bounds.wasCut ? 'cut' : 'not cut'} ${bounds.width} x ${bounds.height}`);
          let badWrap = false;
          let numLines = bounds.lines.length;
          console.log(`${numLines} lines:`);
          for (let i = 0; i < numLines; i++) {
              const t = bounds.lines[i].text;
              if (i < numLines -1) {
                  const wc = t.charAt(t.length - 1);
                  badWrap = wc !== ' ' && wc !== ',' && wc !== '-' && wc !== '.' && wc !== '/';
              }
              console.log(">>> " + t);
          }
          if(!oneLiner && numLines > 1 && !bounds.wasCut  && !badWrap) wasMultiAt = Math.max(wasMultiAt, size);
          let nofit = badWrap || bounds.wasCut || (oneLiner && bounds.lines.length > 1) || bounds.width + 10 > maxWidth || bounds.height > maxHeight;
          // if(!nofit && !oneLiner && numLines < 2) {
          //     if(bounds.height < maxHeight / 2) {
          //         // we've got to be able to get bigger
          //         nofit = false;
          //     }
          // }
          if (nofit) {
              // smaller
              maxSize = size;
              size = (size - minSize) / 2 + minSize;
          } else if (!bounds.wasCut) {
              // larger
              minSize = size;
              size = (maxSize - size) / 2 + minSize;
          }

          // limit to increments of .1
          size = Math.round(Math.floor(size * 10) / 10);

          if (size === lastSize) {
              break;
          }
      }
      let lastSize = size;
      if (wasMultiAt) {
          size = wasMultiAt;
      }
/*
      // part 2 for multilines
      minSize = size;
      maxSize = size * 2;
      while (isMulti) {
          lastSize = size;
          this.fontSize = size;
          const bounds = this.getTextExtent(text, size, maxWidth, maxHeight);
          console.log(`${this.id} test fit @ ${size} is ${bounds.wasCut ? 'cut' : 'not cut'} ${bounds.width} x ${bounds.height}`);
          let badWrap = false;
          let numLines = bounds.lines.length;
          console.log(`${numLines} lines:`);
          for (let i = 0; i < numLines; i++) {
              const t = bounds.lines[i].text;
              if (i < numLines -1) {
                  const wc = t.charAt(t.length - 1);
                  // badWrap = wc !== ' ' && wc !== ',' && wc !== '-' && wc !== '.' && wc !== '/';
              }
              console.log(">>> " + t);
          }
          if(numLines < 2) {
              size++
          } else {
              let nofit = bounds.wasCut || (oneLiner && bounds.lines.length > 1) || bounds.width + 10 > maxWidth || bounds.height > maxHeight;

              if (nofit) {
                  // smaller
                  maxSize = size;
                  size = (size - minSize) / 2 + minSize;
              } else if (!bounds.wasCut) {
                  // larger
                  minSize = size;
                  size = (maxSize - size) / 2 + minSize;
              }
          }
          // limit to increments of .1
          size = Math.round(Math.floor(size * 10) / 10);

          if (size === lastSize) {
              break;
          }
      }
*/
      // weird scale adjustment. magic number...
      size = size * 0.8;
      console.log(`chosen font size is ${lastSize} scaled to ${size}`);
      this.fontSize = 0;
      this.lineHeight = 1;
      this.text = text;
      this.fontSize = size;
      setTimeout(() => {
          const mw = this.getMeasuredWidth();
          const mh = this.getMeasuredHeight();
          const bounds = this.getTextExtent(text, size, mw / scale, mh / scale);
          console.log(`realized control is ${mw} x ${mh} [ ${mw / scale} x ${mh / scale} ]`);
          console.log(`computed bounds is ${bounds.width} x ${bounds.height} @ ${this.fontSize}`);
      });
  }

  public getTextExtent (text: string, textSize: number, maxWidth: number, maxHeight: number): FitResults {

      console.error('this method should be overridden by platform implementation code' + text);
      const results = { width: maxWidth, height: 0, lines: [], wasCut: false };
      return results;
  }

  public greet() {
    return "Hello, Dynamic Label";
  }


}




