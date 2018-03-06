import {Connection} from 'core/classes/connection.class';
import {rendererService as renderer, connectionService, domRefService} from 'core/services';

import * as apps from 'app_modules/applications';
import {clientStateService} from "./core/services";

export class App {

    constructor() {
        [50,100,150,200].forEach(ts => setTimeout(() => {
            document.body.style.minHeight = document.body.offsetHeight + 1 + 'px';
        }, ts)); // fix extention popup height bug. MESSYYY SHIT
    }

    init() {
        console.log('App creating a connection!');
        this.conn = connectionService;
        this.conn.ev.subscribe('hello', data => console.log('App received a hello packet', data));
        this.conn.ev.subscribe('authOk', user => this.onSignIn());
        this.conn.ev.subscribe('signOut', () => window.location.reload());

        domRefService.REF.signInForm.addEventListener('submit', ev => {
            ev.preventDefault();

            this.conn.send('signIn', {
                email: domRefService.REF.signInEmail.value,
                pwd: domRefService.REF.signInPwd.value
            });
        });


        clientStateService.isMaximized$.subscribe(isWide => {
            if( isWide ) {
                domRefService.REF.mainContent.classList.add('wide');
            } else {
                domRefService.REF.mainContent.classList.remove('wide');
            }
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
