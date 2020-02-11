
import { Observable } from 'tns-core-modules/data/observable';

let labels = []
let props;
let step = 0;

class PropModel extends Observable {
    private _text1: string;
    private _text2: string;
    private _text3: string;
    private _text4: string;
    private _text5: string;
    private _text6: string;
    private _style: string;

    set text1 (v) {
        this._text1 = v;
        this.set('text1', v);
    }
    get text1 () { return this._text1; }

    set text2 (v) {
        this._text2 = v;
        this.set('text2', v);
    }
    get text2 () { return this._text2; }

    set text3 (v) {
        this._text3 = v;
        this.set('text3', v);
    }
    get text3 () { return this._text3; }

    set text4 (v) {
        this._text4 = v;
        this.set('text4', v);
    }
    get text4 () { return this._text4; }

    set text5 (v) {
        this._text5 = v;
        this.set('text5', v);
    }
    get text5 () { return this._text5; }

    set text6 (v) {
        this._text6 = v;
        this.set('text6', v);
    }
    get text6 () { return this._text6; }

    set style (v) {
        this._style = v;
        this.set('style', v);
    }
    get style () { return this._style; }

}

export function onMenu (args)  {
    const btn = args.object;
    const page = btn.page;


    page.frame.navigate('home/home-page');
}

export function onNavigatingTo (args) {
    const page = args.object;
    step = 0;

    for(let i=1; i <=6; i++) {
        labels[i] = page.getViewById('styledLabel'+i)
    }

    props = new PropModel();
    props.style = 'default'
    props.text1 = 'First Label';
    props.text2 = 'Second Label';
    props.text3 = 'The Third Label';
    props.text4 = 'This is the 4th Label';
    props.text5 = 'This is the 5th Label';
    props.text6 = 'This is the 6th Label';
    page.bindingContext = props;
}

function show() {

    const style = 'style' + step;
    props.set('style', style) //update the label
    // set the classes to the labels directly
    for(let i=1; i<=6; i++) {
        labels[i].className = 'dlabel '+style
    }
}

export function onNext () {
    if(++step >=6 ) step = 0;
    show();

}
export function onPrev () {
    if(--step < 0 ) step = 5;
    show();
}

