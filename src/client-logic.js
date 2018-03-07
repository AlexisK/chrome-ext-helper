import {rendererService as renderer, domRefService} from 'core/services';

import * as apps from 'app_modules/applications';
import {clientStateService} from "./core/services";

export class Client {

    constructor(connectionService) {
        this.conn = connectionService;
        [50,100,150,200].forEach(ts => setTimeout(() => {
            document.body.style.minHeight = document.body.offsetHeight + 1 + 'px';
        }, ts)); // fix extention popup height bug. MESSYYY SHIT
    }

    init() {
        console.log('App creating a connection!');

        this.conn.ev.subscribe('authOk', user => {
            clientStateService.user$.next(user);
            clientStateService.isAuthorized$.next(true);
            this.onSignIn();
        });
        this.conn.ev.subscribe('signOut', user => {
            clientStateService.user$.next(null);
            clientStateService.isAuthorized$.next(false);
            window.location.reload();
        });

        domRefService.REF['signInForm'].addEventListener('submit', ev => {
            ev.preventDefault();

            this.conn.send('signIn', {
                email: domRefService.REF['signInEmail'].value,
                pwd: domRefService.REF['signInPwd'].value
            });
        });


        clientStateService.isMaximized$.subscribe(isWide => {
            if ( clientStateService.isAlwaysMaximized$.data[0] === true ) { return 0; }
            if( isWide ) {
                domRefService.REF['mainContent'].classList.add('wide');
            } else {
                domRefService.REF['mainContent'].classList.remove('wide');
            }
        });

        clientStateService.isAlwaysMaximized$.filter(v => v).subscribe(() => {
            domRefService.REF['mainContent'].classList.add('wide');
        });
    }


    onSignIn() {
        domRefService.REF['signIn'].style.display = 'none';

        for (let appName in apps) {
            apps[appName].init();
        }
        renderer.process(document.body);
        domRefService.REF['authContent'].style.display = 'block';

    }
}
