import {DomEl, EventManager} from 'core/classes';
import {connectionService} from 'core/services';

export class Application {
    constructor(params) {
        this.title = params.title;
        this.description = params.description;
        this.icon = params.icon;
        this.defaultData = params.defaultData;
        this.createViewWorker = params.createView || (() => new DomEl('div'));
        this.isWide = params.isWide || false;

        this.data = null;
        this.ev = new EventManager();

        this.node = null;
        this.settingsNode = null;
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
        return this.node || (([this.node, this.settingsNode] = this.createView()) && this.node);
    }

    getSettingsView() {
        if ( !this.node ) {
            [this.node, this.settingsNode] = this.createView();
        }
        return this.settingsNode;
    }

    save(ref) {
        if ( ref ) {
            let path = this.searchSavePoint(ref);
            if ( path ) {
                connectionService.send('app-set-targeted.'+this.title, {
                    app: this.title,
                    data: ref,
                    path: path.join('/')
                });
            }
        } else {
            connectionService.send('app-set.'+this.title, {
                app: this.title,
                data: this.data
            });
        }
    }

    searchSavePoint(obj, parent = this.data) {
        if ( typeof(parent) !== 'object') {
            return null;
        }
        if ( obj === parent) {
            return [];
        }
        if ( parent.constructor === Array ) {
            for (let k = 0;  k < parent.length; k++ ) {
                let res = this.searchSavePoint(obj, parent[k]);
                if ( res ) {
                    return [k, ...res];
                }
            }
            return null;
        } else {
            for (let k in parent ) {
                let res = this.searchSavePoint(obj, parent[k]);
                if ( res ) {
                    return [k, ...res];
                }
            }
            return null;
        }
    }
}
