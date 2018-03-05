import {Application, DomEl} from "core/classes";

export const UpdatesTrackerApplication = new Application({
    title: 'UpdatesTracker',
    description: 'Iframe!',
    icon: './svg/perspective.svg',
    defaultData: {
        links: []
    },
    isWide: true,
    createView: function() {
        this.rootNode = new DomEl('div').cls('app-application-updates-tracker');
        
        return [this.rootNode];
    }
});
