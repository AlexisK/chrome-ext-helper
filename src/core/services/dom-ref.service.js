export class DomRefService {
    constructor() {
        if ( typeof(document) !== 'undefined' ) {
            this.REF = Array.prototype.reduce.call(
                document.querySelectorAll('[data-ref]'),
                (acc, node) => (acc[node.getAttribute('data-ref')] = node) && acc,
                {}
            );
        }
    }
}

export const domRefService = new DomRefService();
