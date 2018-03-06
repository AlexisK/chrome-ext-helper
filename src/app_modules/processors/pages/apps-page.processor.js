import { Processor, DomEl } from 'core/classes';
import { clientStateService } from 'core/services';

import * as apps from 'app_modules/applications';

export const AppsPageProcessor = new Processor({
    name    : 'apps-page',
    init    : (self) => {
        self.appsContainer = new DomEl('div').cls('app-apps-page-container apps-list').attachTo(self.node);
        self.appContainer = new DomEl('div').cls('app-apps-page-container hidden').attachTo(self.node);

        self.appsContainerWrapper = self.appsContainer.cr('div').cls('apps-wrapper');
        self.appsContainerWrapper.cr('h3').value('Applications:');


        self.registerApp = app => {
            let appNode = self.appsContainerWrapper
                .cr('div').cls('app-icon-block')
                .addEventListener('click', ev => self.showApp(app));

            appNode.cr('img').attr({ src: app.icon });
            appNode.cr('strong').attr({ tooltip: app.title }).value(app.title);
        };

        clientStateService.focusedApplication$.subscribe(( app, prevApp) => {
            if ( app ) {
                self.appsContainer.node.classList.add('hidden');
                self.appContainer.appendChild(app.getView());
                self.appContainer.node.classList.remove('hidden');

            } else {
                self.appContainer.node.classList.add('hidden');
                if ( prevApp ) {
                    prevApp.node.detach();
                }
                self.appsContainer.node.classList.remove('hidden');
            }
        });

        self.showApp = app => {
            self.closeApp();
            clientStateService.focusedApplication$.next(app);
        };

        self.closeApp = () => {
            clientStateService.focusedApplication$.next(null);
        };

        self.closeApp();

        for ( let appName in apps) {
            self.registerApp(apps[appName]);
        }
    }
});
