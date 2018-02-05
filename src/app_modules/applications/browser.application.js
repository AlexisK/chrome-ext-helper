import {Application, DomEl} from "core/classes";

export const BrowserApplication = new Application({
    title: 'Browser',
    description: 'Iframe!',
    icon: './svg/internet.svg',
    defaultData: {
        lastLink: 'about:blank'
    },
    createView: function() {
        this.rootNode = new DomEl('div');
        this.pathNode = this.rootNode.cr('input').attr({type:'text'}).value(this.data.lastLink);
        this.iframe = this.rootNode.cr('iframe').attr({src: this.data.lastLink});

        this.pathNode.addEventListener('keyup', ev => {
            if ( ev.keyCode === 13 ) { // Enter
                this.data.lastLink = this.pathNode.getValue();
                this.save();
            }
        });

        console.log(this.data);
        this.ev.subscribe('data', () => {
            this.iframe.attr({src: (this.data.lastLink)});
        });

        return this.rootNode;
    }
});
