import * as firebase from 'firebase';
import { BehaviourStream, Stream } from 'core/classes';
import { connectionService } from './connection.service';

export class AuthService {
    constructor() {
        this.user = null;
        this.isAuthorized = false;
        this.userNext = null;

        this.user$ = new Stream();
        this.isAuthorized$ = new BehaviourStream(false);

        this.user$ = new Promise(resolve => {
            this.userNext = user => {
                this.user = user;
                this.isAuthorized = true;
                resolve(user);
            };
        });
    }

    init() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.userNext(this.user = user);
                this.user$.next(user);
                this.isAuthorized$.next(true);
            }
        });
    }

    signOut() {
        connectionService.send('signOut');
    }
}

export const authService = new AuthService();
