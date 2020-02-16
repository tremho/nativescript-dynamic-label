
import { DynamicLabel } from 'nativescript-dynamic-label';

export function goList (args)  {
    const btn = args.object;
    const page = btn.page;

    page.frame.navigate('home/labellist-page');
}
export function goProp (args)  {
    const btn = args.object;
    const page = btn.page;

    page.frame.navigate('home/propbindtest-page');
}
export function goStyle (args)  {
    const btn = args.object;
    const page = btn.page;

    page.frame.navigate('home/styledtest-page');
}
export function goCity(args) {
    const btn = args.object;
    const page = btn.page;

    page.frame.navigate('home/citylabel-page');
}

export function goTest(args) {
    const btn = args.object;
    const page = btn.page;

    const layout = page.content;
    const dl = new DynamicLabel();
    layout.addChild(dl);
    let text = 'a 20pt font should fit nicely into this space created large enough to hold it.';
    try {
        let bounds = dl.getTextExtent(text, 20, 100, 1000);
        let testResults = `${bounds.width} x ${bounds.height} ${(bounds.wasCut ? 'no fit' : 'fits')}`;

        const results = page.getViewById('testResults');
        results.text = testResults;
        dl.width = bounds.width;
        dl.height = bounds.height;

        results.fontSize = 20;
        results.textWrap = true;
        results.paddingLeft = 8;
        results.paddingRight = 8;
        results.backgroundColor = '#00FFFF';
        results.text = text;

        // test a specific label case (not for demo)
        // dl.textWrap = true;
        // dl.backgroundColor = '#FFAAFF';
        // dl.width = 75;
        // dl.height = 40;
        // dl.text = 'Vashon\nMaury Island';
    } catch (e) {
        console.error(e, e.stack);
    }

}
