import {Connection} from 'core/classes/connection.class';
import {rendererService as renderer, connectionService} from 'core/services';

import * as apps from 'app_modules/applications';

export class App {

    constructor() {
        this.REF = Array.prototype.reduce.call(
            document.querySelectorAll('[data-ref]'),
            (acc, node) => (acc[node.getAttribute('data-ref')] = node) && acc,
            {}
        );
    }

    init() {
        console.log('App creating a connection!');
        this.conn = connectionService;
        this.conn.ev.subscribe('hello', data => console.log('App received a hello packet', data));
        this.conn.ev.subscribe('authOk', user => this.onSignIn());

        this.REF.signInForm.addEventListener('submit', ev => {
            ev.preventDefault();

            this.conn.send('signIn', {
                email: this.REF.signInEmail.value,
                pwd: this.REF.signInPwd.value
            });
        });
    }


    onSignIn() {
        this.REF.signIn.style.display = 'none';
        this.REF.mainContent.style.display = 'block';

        for (let appName in apps) {
            apps[appName].init();
        }
        renderer.process(document.body);
    }
}
