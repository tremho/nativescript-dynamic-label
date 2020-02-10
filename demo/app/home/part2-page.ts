import { DynamicLabel } from 'nativescript-dynamic-label';
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';

/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import { NavigatedData, Page } from "tns-core-modules/ui/page";

let container;
let dynLabel;
let step = 0;
let textWrap = true;

const testText: string[] = [
    "Go",
    "Seattle",
    "Vashon",
    "Maury Island, Vashon",
    "Cincinatti",
    "San Francisco",
    "New York",
    "Great Wall of China",
    "Supercalifragiisticexpialidocius"
];
export function onNavigatingTo(args: NavigatedData) {
    let page = <Page>args.object;
    container = page.getViewById('container') as StackLayout;

    // create a DynamicLabel with code and put it on our page
    dynLabel = new DynamicLabel();
    dynLabel.width = 150;
    dynLabel.height = 30;
    dynLabel.backgroundColor = '#ccccff';
    dynLabel.text = 'Dynamic Label';
    container.addChild(dynLabel);
    step = 0;

}

export function onNext (args)  {
    dynLabel.text = testText[step++] || '';
    dynLabel.paddingTop = 0;
    dynLabel.fontSize = 20;
    dynLabel.fitText();
    if (step > testText.length) {
        step = 0;
        dynLabel.textWrap = !dynLabel.textWrap;
    }

}

export function onBack (args)  {
    const btn = args.object;
    const page = btn.page;

    console.log('onBack');

    page.frame.navigate('home/home-page');
}
