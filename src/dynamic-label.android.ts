import { Common } from './dynamic-label.common';
import { LineInfo, FitResults } from './local-types.d';

const { Paint, Rect } = android.graphics;
class PaintType extends Paint {}
class RectType extends Rect {}
class FontMetricsInt extends PaintType.FontMetricsInt {}
const TextView = android.widget.TextView;
class TextViewType extends TextView {}

export class DynamicLabel extends Common {

    public getTextExtent(text: string, textSize: number, maxWidth: number, maxHeight: number): FitResults {

        let lineSpans = [];
        let wasCut;
        const outRect = new Rect();
        try {
            // we should be able to get to our TextView here.
            const tv = this.android as TextViewType;
            const mTextPaint = tv.getPaint() as PaintType;
            mTextPaint.setTextSize(textSize);

            // Build the bounds a line at a time using the text wrappings and the resulting bounds per line
            // that the Android Paint class computes for us according to the wrap algorithm in TextRect below.
            const tr = new TextRect(mTextPaint);
            /*let oneLineHeight = */
            tr.prepare(text, maxWidth, maxHeight); // compute text wrappings
            wasCut = tr.wasTextCut();
            lineSpans = tr.textLinesOut();
            for (let i = 0; i < lineSpans.length; i++) {

                let lineText = lineSpans[i].text;
                let y = lineSpans[i].top;
                const textBounds = new Rect();
                mTextPaint.getTextBounds(lineText, 0, lineText.length, textBounds);
                textBounds.offset(0, y);
                outRect.union(textBounds);
            }
        } catch (e) {
            console.error(e);
        }
        const width = outRect.width();
        const height = outRect.height();
        return {width, height, lines: lineSpans, wasCut};

    }
}

// this code is courtesy Chris Banes: https://chris.banes.dev/2014/03/27/measuring-text/

class TextRect {

    // maximum number of lines; this is a fixed number in order
    // to use a predefined array to avoid ArrayList (or something
    // similar) because filling it does involve allocating memory
    public static MAX_LINES: number = 256;

    // those members are stored per instance to minimize
    // the number of allocations to avoid triggering the
    // GC too much
    private metrics: FontMetricsInt  = null;
    private paint; Paint = null;
    private starts: number[]  = new Array(TextRect.MAX_LINES);
    private stops: number[] = new Array(TextRect.MAX_LINES);
    private lines: number = 0;
    private textHeight: number = 0;
    private bounds: RectType = new Rect();
    private text: string = null;
    private wasCut: boolean = false;

    /**
     * Create reusable text rectangle (use one instance per font).
     *
     * @param paint - paint specifying the font
     */
    constructor (paint: PaintType ) {
        this.metrics = paint.getFontMetricsInt();
        this.paint = paint;
    }

    /**
     * Calculate height of text block and prepare to draw it.
     *
     * @param text - text to draw
     * @param maxWidth - maximum width in pixels
     * @param maxHeight - maximum height in pixels
     * @returns height of text in pixels
     */
    public prepare (text: string, maxWidth: number, maxHeight: number): number {
        this.lines = 0;
        this.textHeight = 0;
        this.text = text;
        this.wasCut = false;

        // get maximum number of characters in one line
        const testText = 'WiM';
        this.paint.getTextBounds(
            testText,
            0,
            testText.length,
            this.bounds );

        let avgWidth = this.bounds.width() / testText.length;
        let maximumInLine = maxWidth / avgWidth;
        let length = text.length;

        if (length > 0 ) {
            let lineHeight = -this.metrics.ascent + this.metrics.descent;
            let start = 0;
            let stop = maximumInLine > length ? length : maximumInLine;

            for ( ; ; ) {
                // skip LF and spaces
                for ( ; start < length; ++start ) {
                    let ch = text.charAt( start );

                    if ( ch !== '\n' &&
                        ch !== '\r' &&
                        ch !== '\t' &&
                        ch !== ' ' )
                        break;
                }

                for (let o = stop + 1; stop < o && stop > start; ) {
                    o = stop;

                    let lowest = text.indexOf( "\n", start );

                    this.paint.getTextBounds(
                        text,
                        start,
                        stop,
                        this.bounds );

                    if ( (lowest >= start && lowest < stop) ||
                        this.bounds.width() > maxWidth ) {
                        --stop;

                        if (lowest < start ||
                            lowest > stop ) {
                            const blank = text.lastIndexOf( " ", stop );
                            const hyphen = text.lastIndexOf( "-", stop );

                            if (blank > start &&
                                (hyphen < start || blank > hyphen) )
                                lowest = blank;
                            else if (hyphen > start )
                                lowest = hyphen;
                        }

                        if (lowest >= start &&
                            lowest <= stop ) {
                            const ch = text.charAt( stop );

                            if (ch !== '\n' &&
                                ch !== ' ' )
                                ++lowest;

                            stop = lowest;
                        }

                        continue;
                    }

                    break;
                }

                if (start >= stop )
                    break;

                let minus = 0;

                // cut off lf or space
                if (stop < length ) {
                    const ch = text.charAt( stop - 1 );

                    if (ch === '\n' ||
                        ch === ' ' )
                        minus = 1;
                }

                if (this.textHeight + lineHeight > maxHeight ) {
                    this.wasCut = true;
                    break;
                }

                this.starts[this.lines] = start;
                this.stops[this.lines] = stop - minus;

                if (++this.lines > TextRect.MAX_LINES ) {
                    this.wasCut = true;
                    break;
                }

                if (this.textHeight > 0 )
                    this.textHeight += this.metrics.leading;

                this.textHeight += lineHeight;

                if (stop >= length )
                    break;

                start = stop;
                stop = length;
            }
        }

        return this.textHeight;
    }

    /**
     * Draw prepared text at given position.
     */
    public textLinesOut(): LineInfo[] {
        const top = 0;
        if (this.textHeight === 0 )
            return [];

        const outLines: LineInfo[] = [];
        const before = -this.metrics.ascent;
        const after = this.metrics.descent + this.metrics.leading;
        let y = top;

        let lines = this.lines;
        --lines;
        for (let n = 0; n <= lines; ++n ) {
            let t: string;

            y += before;

            if (this.wasCut &&
                n === lines &&
                this.stops[n] - this.starts[n] > 3 )
                t = this.text.substring( this.starts[n], this.stops[n] - 3 ).concat( "..." );
            else
                t = this.text.substring( this.starts[n], this.stops[n] );

            outLines.push({text: t, top: y});
            y += after;
        }
        return outLines;
    }


    /** Returns true if text was cut to fit into the maximum height */
    public wasTextCut(): boolean {
        return this.wasCut;
    }
}

