import * as firebase from 'firebase';
import {authService, databaseService} from 'core/services';

export class Server {
    constructor(connections$) {
        this.connections$ = connections$;
        this.firebase = firebase;
        this.authService = authService;
        this.databaseService = databaseService;

        this.port = null;
        this.connections = [];

        console.log('Daemon subscribing to connections!');
        this.connections$.subscribe(conn => {
            this.conn = conn;
            this.connections.push(conn);
            conn.ev.subscribe('disconnect', () => {
                let ind = this.connections.indexOf(conn);
                if ( ind >= 0 ) {
                    this.connections.splice(ind, 1);
                }
            });

            this.checkAuth();
            console.log('Daemon new connection', conn);

            conn.ev.subscribe('signIn', data => {
                console.log('SignIn', data.email);
                firebase.auth().signInWithEmailAndPassword(data.email, data.pwd);
            });

            conn.ev.subscribe('signOut', data => {
                console.log('SignOut');
                firebase.auth().signOut();
                conn.send('SignOut');
            });

            conn.ev.subscribe('app-get', req => {
                conn.send('app.'+req.app, this.databaseService.data.apps[req.app]);
            });

            conn.ev.subscribe('app-set', req => {
                this.databaseService.saveAppData(req).then(() => {
                    // this.conn.send('app.'+req.app, this.databaseService.data.apps[req.app]);
                });
            });
            conn.ev.subscribe('app-set-targeted', req => {
                this.databaseService.saveAppTargetedData(req).then(() => {
                    // this.conn.send('app.'+req.app, this.databaseService.data.apps[req.app]);
                });
            });
        });

        databaseService.ev.subscribe('app-data-update', ([app, data]) => {
            this.connections.forEach(conn => {
                conn.send('app.'+app.title, data);
            });
        });

        this.initFirebase();
    }

    initFirebase() {
        console.log('Daemon initiating firebase');
        let config = {
            apiKey: "AIzaSyAiIAUxm2v1Vz8eEDWdi3kc--86EPngXh4",
            authDomain: "alexisk-work-db.firebaseapp.com",
            databaseURL: "https://alexisk-work-db.firebaseio.com",
            projectId: "alexisk-work-db",
            storageBucket: "alexisk-work-db.appspot.com",
            messagingSenderId: "140637178730"
        };
        firebase.initializeApp(config);
    }

    checkAuth() {
        let sbs = authService.user$.subscribe((user) => {
            databaseService.fetchState().then(() => this.conn.send('authOk', user));
            sbs.unsubscribe();
        });
        authService.init();
    }
}
