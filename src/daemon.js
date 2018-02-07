import * as firebase from 'firebase';
import {Connection} from 'core/classes/connection.class';
import {authService, databaseService} from 'core/services';

class Daemon {
    constructor() {
        this.firebase = firebase;
        this.authService = authService;
        this.databaseService = databaseService;

        this.port = null;

        console.log('Daemon subscribing to connections!');
        chrome.runtime.onConnect.addListener(port => {
            this.conn = new Connection(port);
            this.checkAuth();
            console.log('Daemon new connection', this.conn);

            this.conn.ev.subscribe('signIn', data => {
                console.log('SignIn', data.email);
                firebase.auth().signInWithEmailAndPassword(data.email, data.pwd);
            });

            this.conn.ev.subscribe('app-get', req => {
                this.conn.send('app.'+req.app, this.databaseService.data.apps[req.app]);
            });

            this.conn.ev.subscribe('app-set', req => {
                this.databaseService.saveAppData(req).then(() => {
                    this.conn.send('app.'+req.app, this.databaseService.data.apps[req.app]);
                });
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
        authService.user$.then((user) => {
            databaseService.fetchState().then(() => this.onSignIn(user));
        });
        authService.init();
    }

    onSignIn(user) {
        this.conn.send('authOk', user);
    }
}

export const daemon = new Daemon();
