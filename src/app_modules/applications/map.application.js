import {Application, DomEl} from "core/classes";

export const MapApplication = new Application({
    title: 'Map',
    description: 'Iframe!',
    icon: './svg/map.svg',
    defaultData: {},
    isWide: true,
    createView: function() {
        this.rootNode = new DomEl('div').cls('app-application-map');
        this.iframeWrap = this.rootNode.cr('div').cls('iframe-wrap');
        this.iframe = this.iframeWrap.cr('iframe').attr({
            src: 'https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d5082.291123308935!2d30.522350600000003!3d50.4383893!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sru!2sfi!4v1519047576571'
        });

        return this.rootNode;
    }
});
