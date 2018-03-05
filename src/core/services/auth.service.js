import * as firebase from 'firebase';
import { connectionService } from './connection.service';

export class AuthService {
    constructor() {
        this.user = null;
        this.isAuthorized = false;
        this.userNext = null;

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
                this.userNext(user);
            }
        });
    }

    signOut() {
        connectionService.send('signOut');
    }
}

export const authService = new AuthService();
