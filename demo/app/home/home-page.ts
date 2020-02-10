import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout'

/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

export function onNext (args)  {
    const btn = args.object;
    const page = btn.page;

    console.log('onNext');

    page.frame.navigate('home/part2-page')
}
