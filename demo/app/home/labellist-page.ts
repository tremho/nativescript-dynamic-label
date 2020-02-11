
export function onNext (args)  {
    const btn = args.object;
    const page = btn.page;

    page.frame.navigate('home/part2-page');
}
export function onMenu (args)  {
    const btn = args.object;
    const page = btn.page;

    page.frame.navigate('home/home-page');
}
