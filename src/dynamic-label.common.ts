import { Label } from 'tns-core-modules/ui/label';
import { EventData } from 'tns-core-modules/data/observable';
import { FitResults } from "./local-definitions";
import { screen } from 'tns-core-modules/platform';
const scale = screen.mainScreen.scale;

export class Common extends Label {

  private _isLoaded: boolean;
  private _didLayout: boolean;

  constructor() {
      super();
      this.on('layoutChanged', (eventData: EventData) => {
          const lbl = eventData.object as Common;
          if (this._isLoaded) {
              if (!this._didLayout) {
                  this._didLayout = true;
                  setTimeout(() => { lbl.fitText(); });
              }

          }
      });
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
              this.fontSize = Number.MAX_SAFE_INTEGER;
              setTimeout(() => { lbl.fitText(); });
          }
      });
  }


  private findWidth(): number {
      function widthOf (view) {
          if (!view || typeof view.getMeasuredWidth !== 'function') return 0;
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
            if (!view || typeof view.getMeasuredHeight !== 'function') return 0;
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
            // console.log(`horizontal padding ${l} and ${r}`);
            return l + r;
        }
        let t = propValueOf(this, 'paddingTop');
        let b = propValueOf(this, 'paddingBottom');
        // console.log(`vertical padding ${t} and ${b}`);
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
      // console.log(`\\/------------------------ ${this.id} -------------------\\/`);
      // console.log(`control id ${this.id} : ${this.width} x ${this.height}`);
      let text = this.text;
      // if (text === 'Seattle, WA') {
      //     if (this.id === 'dl2w') {
      //       // console.log('debug break here');
      //     }
      // }
      // if (text.indexOf('9thEntry') !== -1) {
      //     // console.log("debug break here");
      // }
      // if (text.indexOf('Supercalifrag') !== -1) {
      //     // console.log("debug break here");
      // }
      let size = 0;
      // let oldvis = this.get('visibility');
      // this.set('visibility', 'hidden');
      let minSize = 1;
      let maxWidth = this.findRenderWidth();
      let maxHeight = this.findRenderHeight();
      let testWidth = maxWidth; // * 0.9;
      let testHeight = maxWidth; // * 0.6;
      let maxSize = (maxHeight - size) / 2 + size;
      this.fontSize = maxSize;
      size = maxSize;
      // console.log(`detected target bounds are ${maxWidth} x ${maxHeight}`);

      let noBadWrap = (text.indexOf('\n') !== -1);
      let oneLiner = !this.textWrap;
      let wasMultiAt = 0;
      let wasTightMulti = false;
      while (true) {
          let lastSize = size;
          this.fontSize = size;
          const bounds = this.getTextExtent(text, size, maxWidth, maxHeight);
          // console.log(`${this.id} test fit @ ${size} is ${bounds.wasCut ? 'cut' : 'not cut'} ${bounds.width} x ${bounds.height}`);
          let badWrap = false;
          let numLines = bounds.lines.length;
          // console.log(`${numLines} lines:`);
          for (let i = 0; i < numLines; i++) {
              const t = bounds.lines[i].text;
              if (i < numLines - 1) {
                  const wc = t.charAt(t.length - 1);
                  if (!noBadWrap) {
                      badWrap = wc !== '\n' && wc !== ' ' && wc !== ',' && wc !== '-' && wc !== '.' && wc !== '/';
                  }
              }
              // console.log(">>> " + t + (badWrap ? '<!' : ''));
          }
          if (!oneLiner && numLines > 1 && !bounds.wasCut && !badWrap) {
              if (wasTightMulti)  {
                  wasMultiAt = (wasMultiAt + size) / 2;
              }
              else wasMultiAt = Math.max(wasMultiAt, size);
              wasTightMulti = badWrap || bounds.height > testHeight * 0.67;
              // console.log(`multi choice is ${(wasTightMulti ? 'tight' : '')} ` + wasMultiAt);
          }
          let nofit = badWrap || bounds.wasCut || (oneLiner && bounds.lines.length > 1) || bounds.width  > testWidth || bounds.height > testHeight;
          // console.log(`${this.id} test ${(nofit ? 'NO fit' : 'fits')} @ ${size} => ${bounds.wasCut ? 'cut' : 'not cut'} ${bounds.width} x ${bounds.height} ${badWrap ? 'badWrap' : 'goodWrap'}`);

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
          size = (wasMultiAt + size) / 2;
      }
      size /= 1.5;
      // console.log(`chosen font size is ${lastSize} scaled to ${size}`);
      this.fontSize = 0;
      this.lineHeight = 1;
      this.text = text;
      this.fontSize = size;
      setTimeout(() => {
          const mw = this.getMeasuredWidth();
          const mh = this.getMeasuredHeight();
          const bounds = this.getTextExtent(text, size, mw / scale, mh / scale);
          // console.log(`realized control is ${mw} x ${mh} [ ${mw / scale} x ${mh / scale} ]`);
          // console.log(`computed bounds is ${bounds.width} x ${bounds.height} @ ${this.fontSize}`);
          // this.set('visibility', oldvis);
          this._didLayout = false;
      });
  }

  public getTextExtent (text: string, textSize: number, maxWidth: number, maxHeight: number): FitResults {

      // console.error('this method should be overridden by platform implementation code' + text);
      const results = { width: maxWidth, height: 0, lines: [], wasCut: false };
      return results;
  }

  public greet() {
    return "Hello, Dynamic Label";
  }


}




