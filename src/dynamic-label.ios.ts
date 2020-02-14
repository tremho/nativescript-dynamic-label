import { Common } from './dynamic-label.common';
import { Bounds, FitResults, LineInfo, LineFit } from "./local-definitions";
import { screen } from 'tns-core-modules/platform';
const scale = screen.mainScreen.scale;

let fitRange;

const DBL_MAX = Number.MAX_SAFE_INTEGER;
const FLOAT_MAX =  Number.MAX_VALUE;
const CGFLOAT_MAX = FLOAT_MAX;

export class DynamicLabel extends Common {

    // Adapted for ios from android version
    public getTextExtent(text: string, textSize: number, maxWidth: number, maxHeight: number): FitResults {

        let lineSpans = [];
        let wasCut;
        let outBounds = CGSizeMake(0, 0);
        let originalFontSize = this.fontSize;
        try {
            // we should be able to get to our TextView here.
            const uiLabel = this.ios as UILabel;
            this.fontSize = textSize;
            // const mTextPaint = tv.getPaint() as PaintType;
            // mTextPaint.setTextSize(textSize);

            // Build the bounds a line at a time using the text wrappings and the resulting bounds per line
            // that the Android Paint class computes for us according to the wrap algorithm in TextRect below.
            const tr = new TextRect(uiLabel);
            outBounds = tr.prepare(text, maxWidth, maxHeight); // compute text wrappings
            wasCut = tr.wasTextCut();
            lineSpans = tr.textLinesOut();
        } catch (e) {
            console.error(e);
        }
        this.fontSize = originalFontSize;
        const width = outBounds.width;
        const height = outBounds.height;
        return {width, height, lines: lineSpans, wasCut};

    }

}

// Adapted for ios from the android version
class TextRect {

    // maximum number of lines; this is a fixed number in order
    // to use a predefined array to avoid ArrayList (or something
    // similar) because filling it does involve allocating memory
    public static MAX_LINES: number = 256;

    // those members are stored per instance to minimize
    // the number of allocations to avoid triggering the
    // GC too much
    // private metrics: FontMetricsInt = null;
    private uiLabel: UILabel;
    private starts: number[] = new Array(TextRect.MAX_LINES);
    private stops: number[] = new Array(TextRect.MAX_LINES);
    private lines: number = 0;
    private textHeight: number = 0;
    private lineHeight: number = 0;
    private bounds: CGSize = new CGSize();
    private text: string = null;
    private wasCut: boolean = false;

    /**
     * Create reusable text rectangle (use one instance per font).
     *
     * @param paint - paint specifying the font
     */
    constructor(uiLabel: UILabel) {
        this.uiLabel = uiLabel;
    }

    /**
     * Calculate height of text block and prepare to draw it.
     *
     * @param text - text to draw
     * @param maxWidth - maximum width in pixels
     * @param maxHeight - maximum height in pixels
     * @returns height of text in pixels
     */
    public prepare(text: string, maxWidth: number, maxHeight: number): Bounds {
        this.lines = 0;
        this.textHeight = 0;
        this.text = text;
        this.wasCut = false;

        // get maximum number of characters in one line
        let lineFitInfo = this.findLineFit(text, maxWidth);
        let maximumInLine = lineFitInfo.maxIndex;
        let length = text.length;

        if (length > 0) {
            this.lineHeight = lineFitInfo.height;
            let start = 0;
            let stop = maximumInLine;

            for (; ;) {
                // skip LF and spaces
                for (; start < length; ++start) {
                    let ch = text.charAt(start);

                    if (ch !== '\n' &&
                        ch !== '\r' &&
                        ch !== '\t' &&
                        ch !== ' ')
                        break;
                }

                for (let o = stop + 1; stop < o && stop > start;) {
                    o = stop;

                    let lowest = text.indexOf("\n", start);

                    // this.paint.getTextBounds(
                    //     text,
                    //     start,
                    //     stop,
                    //     this.bounds);
                    let subtext = text.substring(start, stop);
                    let subfit = this.findLineFit(subtext, maxWidth);
                    if (subfit.width > this.bounds.width) this.bounds.width = subfit.width;
                    this.bounds.height += subfit.height;

                    // interop.free(interop.Pointer(nstext))

                    if ((lowest >= start && lowest < stop) ||
                        subfit.width > maxWidth) {
                        --stop;

                        if (lowest < start ||
                            lowest > stop) {
                            const blank = text.lastIndexOf(" ", stop);
                            const hyphen = text.lastIndexOf("-", stop);

                            if (blank > start &&
                                (hyphen < start || blank > hyphen))
                                lowest = blank;
                            else if (hyphen > start)
                                lowest = hyphen;
                        }

                        if (lowest >= start &&
                            lowest <= stop) {
                            const ch = text.charAt(stop);

                            if (ch !== '\n' &&
                                ch !== ' ')
                                ++lowest;

                            stop = lowest;
                        }

                        continue;
                    }

                    break;
                }

                if (start >= stop)
                    break;

                let minus = 0;

                // cut off lf or space
                if (stop < length) {
                    const ch = text.charAt(stop - 1);

                    if (ch === '\n' ||
                        ch === ' ')
                        minus = 1;
                }

                if (this.textHeight + this.lineHeight > maxHeight) {
                    this.wasCut = true;
                    break;
                }

                this.starts[this.lines] = start;
                this.stops[this.lines] = stop - minus;


                if (++this.lines > TextRect.MAX_LINES) {
                    this.wasCut = true;
                    break;
                }

                // if (this.textHeight > 0)
                //     this.textHeight += this.metrics.leading;

                this.textHeight += this.lineHeight;

                if (stop >= length)
                    break;

                start = stop;
                stop = length;
            }
        }

        return this.bounds;
    }
    public textLinesOut(): LineInfo[] {
        const top = 0;
        if (this.textHeight === 0 )
            return [];

        const outLines: LineInfo[] = [];
        // const before = -this.metrics.ascent;
        // const after = this.metrics.descent + this.metrics.leading;
        let y = top;

        let lines = this.lines;
        --lines;
        for (let n = 0; n <= lines; ++n ) {
            let t: string;

            t = this.text.substring( this.starts[n], this.stops[n] );

            outLines.push({text: t, top: y});
            y += this.lineHeight;
        }
        return outLines;
    }


    /** Returns true if text was cut to fit into the maximum height */
    public wasTextCut(): boolean {
        return this.wasCut;
    }

    public findLineFit(text: string, cwidth: number): LineFit {
        let index = text.length;
        let width, height;
        while (--index) {
            let nstext = NSString.alloc().initWithString(text.substring(0, index));
            let fsize = nstext.sizeWithFont(this.uiLabel.font);
            // interop.free(interop.Pointer(nstext));
            if (fsize.width / scale < cwidth) {
                width = fsize.width;
                height = fsize.height;
                break;
            }
        }
        return { maxIndex: index + 1, width, height };
    }

}