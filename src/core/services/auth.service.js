import * as firebase from 'firebase';

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
}

export const authService = new AuthService();
