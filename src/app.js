import {Connection} from 'core/classes/connection.class';
import {rendererService as renderer, connectionService, domRefService} from 'core/services';

import * as apps from 'app_modules/applications';

export class App {

    constructor() {
    }

    init() {
        console.log('App creating a connection!');
        this.conn = connectionService;
        this.conn.ev.subscribe('hello', data => console.log('App received a hello packet', data));
        this.conn.ev.subscribe('authOk', user => this.onSignIn());

        domRefService.REF.signInForm.addEventListener('submit', ev => {
            ev.preventDefault();

            this.conn.send('signIn', {
                email: domRefService.REF.signInEmail.value,
                pwd: domRefService.REF.signInPwd.value
            });
        });
    }


    onSignIn() {
        domRefService.REF.signIn.style.display = 'none';

        for (let appName in apps) {
            apps[appName].init();
        }
        renderer.process(document.body);
        domRefService.REF.authContent.style.display = 'block';
    }
}
