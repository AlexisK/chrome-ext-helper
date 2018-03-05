import { Processor, DomEl } from 'core/classes';
import { domRefService } from 'core/services';

import * as apps from 'app_modules/applications';

export const AppsPageProcessor = new Processor({
    name    : 'apps-page',
    init    : (self) => {
        self.currentApp = null;

        self.appsContainer = new DomEl('div').cls('app-apps-page-container').attachTo(self.node);
        self.appContainer = new DomEl('div').cls('app-apps-page-container hidden').attachTo(self.node);
        self.appsContainerWrapper = self.appsContainer.cr('div').cls('apps-wrapper');

        self.appNavContainer = self.appContainer.cr('div').cls('app-navbar');
        self.appNavContainer.cr('button').cls('app-navbar-button')
            .addEventListener('click', () => self.closeApp())
            .cr('img').attr({src: './svg/app.svg'});
        self.appNavSettingsButton = self.appNavContainer.cr('button').cls('app-navbar-button right')
            .addEventListener('click', () => {});
        self.appNavSettingsButton.cr('img').attr({src: './svg/settings-1.svg'});

        self.appNavTitle = self.appNavContainer.cr('strong').cls('app-navbar-text');


        self.registerApp = app => {
            let appNode = self.appsContainerWrapper
                .cr('div').cls('app-icon-block')
                .addEventListener('click', ev => self.showApp(app));

            appNode.cr('img').attr({ src: app.icon });
            appNode.cr('strong').attr({ tooltip: app.title }).value(app.title);
        };

        self.showApp = app => {
            self.closeApp();
            self.appsContainer.node.classList.add('hidden');

            if( app.isWide ) {
                domRefService.REF.mainContent.classList.add('wide');
            }

            self.currentApp = app;
            self.appNavTitle.value(app.title);
            self.appContainer.appendChild(self.currentApp.getView());

            if ( self.currentApp.getSettingsView() ) {
                self.appNavSettingsButton.node.style.display = 'block';
            } else {
                self.appNavSettingsButton.node.style.display = 'node';
            }

            self.appContainer.node.classList.remove('hidden');
        };

        self.closeApp = () => {
            domRefService.REF.mainContent.classList.remove('wide');
            self.appContainer.node.classList.add('hidden');
            if ( self.currentApp ) {
                self.currentApp.node.detach();
            }
            self.appsContainer.node.classList.remove('hidden');
        };

        for ( let appName in apps) {
            self.registerApp(apps[appName]);
        }
    },
    process : (self) => {

    },
    destroy: (self) => {

    }
});
