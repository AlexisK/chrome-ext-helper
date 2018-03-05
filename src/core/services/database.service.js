import * as firebase from 'firebase';
import {EventManager} from 'core/classes';
import {authService} from 'core/services';
import * as apps from 'app_modules/applications';

console.log(apps);
const dummyUserData = {
    version: ENV.storageVer,
    apps: Object.keys(apps).reduce((acc, k) => (acc[apps[k].title] = apps[k].defaultData) && acc, {}),
    settings: {
        displayName: true
    }
};

export class DatabaseService {
    constructor() {
        this.ev = new EventManager();
        this.data = null;
        this.fetchStatePromise = null;
    }

    fetchState() {
        return this.fetchStatePromise || (this.fetchStatePromise = new Promise(resolve => {
            this.ref().once('value')
                .then(v => v.val())
                .then(v => {
                    for (let k in apps) {
                        let app = apps[k];

                        this.subscribeAppData(app, data => {
                            if ( data ) { // handle null
                                v.apps[k] = data;
                                this.data.apps[app.title] = data;
                                this.ev.emit('app-data-update.'+app.title, [app, data]);
                            }
                        });
                    }

                    if ( v && v.version === ENV.storageVer ) {
                        for (let k in dummyUserData.apps) {
                            if ( ! v.apps[k] ) {
                                v.apps[k] = dummyUserData.apps[k];
                            }
                        }
                        resolve(this.data = v);
                    } else {
                        this.initializeUserData().then(resolve);
                    }
                });
        }));
    }

    initializeUserData() {
        return new Promise(resolve => {
            this.ref().set(dummyUserData)
                .then(v => v.val())
                .then(v => resolve(this.data = v));
        });
    }

    ref(path = '') {
        return firebase.database().ref(['users', authService.user.uid, path].join('/'));
    }

    subscribeAppData(app, worker) {
        this.ref('apps/'+app.title).on('value', snapshot => {
            let data = snapshot.val();
            worker(data);
        });
    }

    saveAppData(req) {
        return this.ref('apps/'+req.app).set(req.data);
    }

    saveAppTargetedData(req) {
        return this.ref(['apps',req.app,req.path].join('/')).set(req.data);
    }
}

export const databaseService = new DatabaseService();

