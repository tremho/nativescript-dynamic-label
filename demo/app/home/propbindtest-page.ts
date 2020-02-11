
import { Observable } from 'tns-core-modules/data/observable';

let props;

const testItems = [
    'X',
    'Hello',
    'Seattle, WA',
    'San Francisco, CA',
    'Albuquerque, NM',
    'Llanfairpwllgwyngyll, Wales',
    'National Mall, Washington, D.C.'
];
let step = 0;

class PropModel extends Observable {
    private _text1: string;
    private _text2: string;
    private _text3: string;

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
}

export function onNext ()  {
    if (++step >= testItems.length) step = 0;
    show();
}
export function onPrev () {
    if (--step < 0) step = testItems.length-1;
    show();

}

export function onMenu (args)  {
    const btn = args.object;
    const page = btn.page;

    page.frame.navigate('home/home-page');
}

export function onNavigatingTo (args) {
    const page = args.object;
    step = 0;

    props = new PropModel();
    props.text1 = '1';
    props.text2 = '2';
    props.text3 = '3';
    page.bindingContext = props;

}

function show () {
    let t = testItems[step];

    props.set('text1', t);
    props.set('text2', t);
    props.set('text3', t);
}
