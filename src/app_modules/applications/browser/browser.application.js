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
        this.rootNode = new DomEl('div').cls('app-application-browser');
        this.pathNode = this.rootNode.cr('input').attr({type:'text'}).value(this.data.link);
        this.iframeWrap = this.rootNode.cr('div').cls('iframe-wrap');
        this.iframe = this.iframeWrap.cr('iframe').attr({src: this.data.link});

        chrome.extension.onMessage.addListener(request => {
            let url = request['iframe-url-hook'];
            if ( url ) {
                let urlParams = url.split('/');
                if ( urlParams[2] && urlParams[2] === this.data.domain ) {
                    this.data.link = url;
                    this.pathNode.value(url);
                    this.save();
                }
            }
        });

        this.setUpNewPath = url => {
            this.data.link = url;
            this.data.domain = url.split('/')[2];
            this.save();
            this.iframe.attr({src: url});
        };

        this.pathNode.addEventListener('keyup', ev => {
            if ( ev.keyCode === 13 ) { // Enter
                this.setUpNewPath(this.pathNode.getValue());
            }
        });

        return [this.rootNode];
    }
});
