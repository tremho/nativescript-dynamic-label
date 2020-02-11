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
