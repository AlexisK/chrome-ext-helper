import * as firebase from 'firebase';
import {authService} from 'core/services';
import * as apps from 'app_modules/applications';

const dummyUserData = {
    version: ENV.storageVer,
    apps: Object.keys(apps).reduce((acc, k) => (acc[apps[k].title] = apps[k].defaultData) && acc, {}),
    settings: {
        displayName: true
    }
};

export class DatabaseService {
    constructor() {
        this.data = null;
        this.fetchStatePromise = null;
    }

    fetchState() {
        this.ref().on('value', snapshot => {
            this.data = snapshot.val();
        });
        return this.fetchStatePromise || (this.fetchStatePromise = new Promise(resolve => {
            this.ref().once('value')
                .then(v => v.val())
                .then(v => {
                    if ( v && v.version === ENV.storageVer ) {
                        resolve(this.data = v);
                    } else {
                        this.initializeUserData().then(resolve);
                    }
                });
        }));
    }

    initializeUserData() {
        console.log(dummyUserData);
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

