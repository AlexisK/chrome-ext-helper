import {crDom} from "../helpers";

function getNodeFromTarget(target) {
    if ( target instanceof DomEl ) {
        return target.node;
    } else {
        return target;
    }
}

const usesValueAttrAsText = {
    input: true,
    textarea: true
};

export class DomEl {
    constructor(tag) {
        this.node = crDom({tag});
        this.isUsesValueAttrAsText = usesValueAttrAsText[tag.toLowerCase()] || false;
    }

    cls(str) {
        this.node.className = str;
        return this;
    }

    attr(data) {
        if (typeof(data) === 'object') {
            for ( let k in data ) {
                this.node.setAttribute(k, data[k]);
            }
            return this;
        }  else {
            return this.node.getAttribute(data);
        }
    }

    attachTo(target) {
        getNodeFromTarget(target).appendChild(this.node);
        return this;
    }

    detach() {
        if ( this.node.parentNode ) {
            this.node.parentNode.removeChild(this.node);
        }
    }

    cr(tag) {
        return new DomEl(tag).attachTo(this);
    }

    getValue() {
        if ( this.isUsesValueAttrAsText ) {
            return this.node.value;
        }
        return this.node.textContent;
    }

    value(value) {
        if ( this.isUsesValueAttrAsText ) {
            this.node.value = value;
        } else {
            this.node.textContent = value;
        }
        return this;
    }


    appendChild(target) {
        this.node.appendChild(getNodeFromTarget(target));
        return this;
    }

    removeChild(target) {
        let targetNode = getNodeFromTarget(target);
        if ( targetNode.parentNode === this.node ) {
            this.node.removeChild(targetNode);
        }
        return this;
    }

    addEventListener(evName, worker) {
        this.node.addEventListener(evName, worker);
        return this;
    }
}
