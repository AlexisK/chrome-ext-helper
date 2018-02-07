import {Application, DomEl} from "core/classes";

export const BrowserApplication = new Application({
    title: 'Browser',
    description: 'Iframe!',
    icon: './svg/internet.svg',
    defaultData: {
        link: 'about:blank'
    },
    isWide: true,
    createView: function() {
        this.lastLink = this.data.link;
        this.rootNode = new DomEl('div').cls('app-application-browser');
        this.pathNode = this.rootNode.cr('input').attr({type:'text'}).value(this.data.link);
        this.iframeWrap = this.rootNode.cr('div').cls('iframe-wrap');
        this.iframe = this.iframeWrap.cr('iframe').attr({src: this.data.link});

        this.pathNode.addEventListener('keyup', ev => {
            if ( ev.keyCode === 13 ) { // Enter
                this.data.link = this.pathNode.getValue();
                this.save();
            }
        });

        this.ev.subscribe('data', () => {
            if ( this.data.link !== this.lastLink ) {
                this.iframe.attr({src: (this.data.link)});
            }
            this.lastLink = this.data.link;
        });

        return this.rootNode;
    }
});
