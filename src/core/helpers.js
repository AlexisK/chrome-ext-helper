export function forEach(ref, cb) {
    if ( !ref || !ref.constructor ) { return null; }
    if ( ref.constructor === Array ) {
        for ( var k = 0; k < ref.length; k++) {
            cb(ref[k], k);
        }
    } else {
        for ( var k in ref ) {
            cb(ref[k], k);
        }
    }
}

export function crDom(params) {
    let dom = document.createElement(params.tag);
    if ( params.class ) { dom.className = params.class; }
    if ( params.text ) { dom.textContent = params.text; }
    if ( params.parent ) { params.parent.appendChild(dom); }
    if ( params.attr ) {
        for ( let k in params.attr ) {
            if ( params.attr[k] === null ) {
                dom.removeAttribute(k);
            } else {
                dom.setAttribute(k, params.attr[k]);
            }
        }
    }
    return dom;
}
