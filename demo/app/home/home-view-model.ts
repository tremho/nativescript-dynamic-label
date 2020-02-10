import { Observable } from "tns-core-modules/data/observable";

export class HomeViewModel extends Observable {
    constructor() {
        super();
    }
    set text (t) {
        this.set('text', t)
    }
    get text() {
        return this.get('text')
    }
}
