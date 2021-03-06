import {Application, DomEl} from "core/classes";

const proxy = '';

export const BrowserApplication = new Application({
    title: 'Browser',
    description: 'Iframe!',
    icon: './svg/internet.svg',
    defaultData: {
        link: 'about:blank'
    },
    createView: function() {
        this.pathNode = new DomEl('input').cls('app-navbar-input')
            .attr({type:'text'}).value(this.data.link);

        this.rootNode = new DomEl('div').cls('app-application-browser');
        this.iframeWrap = this.rootNode.cr('div').cls('iframe-wrap');
        this.iframe = this.iframeWrap.cr('iframe').attr({src: proxy+this.data.link});

        if ( chrome.extension ) {
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
        }

        this.setUpNewPath = url => {
            this.data.link = url;
            this.data.domain = url.split('/')[2];
            this.save();
            this.iframe.attr({src: proxy+url});
        };

        this.pathNode.addEventListener('keyup', ev => {
            if ( ev.keyCode === 13 ) { // Enter
                this.setUpNewPath(this.pathNode.getValue());
            }
        });

        return [this.rootNode, this.pathNode];
    }
});
