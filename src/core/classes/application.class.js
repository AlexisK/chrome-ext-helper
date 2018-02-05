import {DomEl, EventManager} from 'core/classes';
import {connectionService} from 'core/services';

export class Application {
    constructor(params) {
        this.title = params.title;
        this.description = params.description;
        this.icon = params.icon;
        this.defaultData = params.defaultData;
        this.createViewWorker = params.createView || (() => new DomEl('div'));

        this.data = null;
        this.ev = new EventManager();

        this.node = null;
    }

    init() {
        connectionService.ev.subscribe('app.'+this.title, (data) => {
            this.data = data;
            this.ev.emit('data', this.data);
        });
        connectionService.send('app-get.'+this.title, {
            app: this.title
        });
    }

    createView() {
        return this.createViewWorker.call(this);
    }

    getView() {
        return this.node || (this.node = this.createView());
    }

    save() {
        connectionService.send('app-set.'+this.title, {
            app: this.title,
            data: this.data
        });
    }
}
