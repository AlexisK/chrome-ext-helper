import { Processor, DomEl } from 'core/classes';
import { domRefService } from 'core/services';

import * as apps from 'app_modules/applications';

const noAppString = 'Menu:';

export const AppsPageProcessor = new Processor({
    name    : 'apps-page',
    init    : (self) => {
        self.currentApp = null;
        self.isWide = false;

        // navbar
        self.navContainer = new DomEl('div').cls('app-navbar').attachTo(self.node);
        self.navContainer.cr('button').cls('app-navbar-button')
            .addEventListener('click', () => self.closeApp())
            .cr('img').attr({src: './svg/menu-1.svg'});
        self.closeAppButton = self.navContainer.cr('button').cls('app-navbar-button right')
            .addEventListener('click', () => self.closeApp());
        self.closeAppButton.cr('img').attr({src: './svg/error.svg'});
        self.expandAppButton = self.navContainer.cr('button').cls('app-navbar-button right')
            .addEventListener('click', () => {
                if( self.isWide ) {
                    self.isWide = false;
                    domRefService.REF.mainContent.classList.remove('wide');
                } else {
                    self.isWide = true;
                    domRefService.REF.mainContent.classList.add('wide');
                }
            });
        self.expandAppButton.cr('img').attr({src: './svg/plus.svg'});
        self.navTitle = self.navContainer.cr('strong').cls('app-navbar-text').value(noAppString);


        self.appsContainer = new DomEl('div').cls('app-apps-page-container').attachTo(self.node);
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

        self.showApp = app => {
            self.closeApp();
            self.closeAppButton.enable();
            self.appsContainer.node.classList.add('hidden');

            if( app.isWide ) {
                self.expandAppButton.disable();
                domRefService.REF.mainContent.classList.add('wide');
            }

            self.currentApp = app;
            self.navTitle.value(app.title);
            self.appContainer.appendChild(self.currentApp.getView());

            // if ( self.currentApp.getSettingsView() ) {
            //     self.appNavSettingsButton.node.style.display = 'block';
            // } else {
            //     self.appNavSettingsButton.node.style.display = 'node';
            // }

            self.appContainer.node.classList.remove('hidden');
        };

        self.closeApp = () => {
            self.closeAppButton.disable();
            self.expandAppButton.enable();
            if ( !self.isWide ) {
                domRefService.REF.mainContent.classList.remove('wide');
            }
            self.appContainer.node.classList.add('hidden');
            if ( self.currentApp ) {
                self.currentApp.node.detach();
                self.navTitle.value(noAppString);
            }
            self.appsContainer.node.classList.remove('hidden');
        };

        self.closeApp();

        for ( let appName in apps) {
            self.registerApp(apps[appName]);
        }
    },
    process : (self) => {

    },
    destroy: (self) => {

    }
});
