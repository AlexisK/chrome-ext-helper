import { Processor, DomEl, BehaviourStream } from 'core/classes';
import { clientStateService } from 'core/services';
import {authService} from "../../../core/services";

export const AppNavbarProcessor = new Processor({
    name    : 'app-navbar',
    init    : (self, params) => {
        let menuOptions = [
            ['Open as a tab', ev => {
                chrome.tabs.create({url: window.location.href});
            }],
            ['Logout', ev => authService.signOut()]
        ];


        self.menuOpen$ = new BehaviourStream(false);
        self.actionsOpen$ = new BehaviourStream(false);
        self.parentNode = new DomEl('div').cls('app-navbar').attachTo(self.node);
        new DomEl('div').cls('app-navbar-placeholder').attachTo(self.node);

        self.parentNode.cr('div').cls('app-navbar-button'); // placeholder
        self.menuButton = self.parentNode.cr('button').cls('app-navbar-button')
            .addEventListener('click', () => {
                self.menuOpen$.next(!self.menuOpen$.data[0]);
            })
            .cr('img').attr({src: './svg/menu-1.svg'});

        self.parentNode.cr('div').cls('app-navbar-button right'); // placeholder
        self.closeButton = self.parentNode.cr('button').cls('app-navbar-button right')
            .addEventListener('click', () => clientStateService.focusedApplication$.next(null));
        self.closeButton.cr('img').attr({src: './svg/error.svg'});
        self.expandButton = self.parentNode.cr('button').cls('app-navbar-button right')
            .addEventListener('click', () => {
                clientStateService.isMaximized$.next(!clientStateService.isMaximized$.data[0]);
            });
        self.expandButtonImg = self.expandButton.cr('img');
        self.actionsButton = self.parentNode.cr('button').cls('app-navbar-button right')
            .addEventListener('click', () => {
                self.actionsOpen$.next(!self.actionsOpen$.data[0]);
            });
        self.actionsButton.cr('img').attr({src: './svg/info.svg'});

        self.textNode = self.parentNode.cr('div').cls('app-navbar-text');


        // MENU
        self.menuContainer = self.parentNode.cr('div').cls('app-navbar menu-container');
        self.actionsContainer = self.parentNode.cr('div').cls('actions-container mat-form');
        menuOptions.forEach(([key, worker]) => self.actionsContainer
            .cr('button').value(key).addEventListener('click', worker)
        );
        document.body.addEventListener('click', ev => {
            if ( ev.target !== self.parentNode && !self.parentNode.node.contains(ev.target) ) {
                self.menuOpen$.next(false);
                self.actionsOpen$.next(false);
            }
        });

        self.menuOpen$.subscribe(state => state && self.menuContainer.show() || self.menuContainer.hide());
        self.actionsOpen$.subscribe(state => state && self.actionsContainer.show() || self.actionsContainer.hide());
    },
    process : (self) => {
        let domInSettings = [];

        clientStateService.isMaximized$.subscribe(state => state
            && self.expandButtonImg.attr({src: './svg/minus.svg'})
            || self.expandButtonImg.attr({src: './svg/plus.svg'})
        );
        clientStateService.focusedApplication$.subscribe(app => {
            if ( app ) {
                self.textNode.value(app.title);
                self.closeButton.enable();

                let settingsDom = app.getSettingsView();
                if ( settingsDom ) {
                    self.menuContainer.appendChild(settingsDom);
                    domInSettings.push(settingsDom);
                }
            } else {
                domInSettings.forEach(node => node.detach());
                domInSettings.length = 0;
                self.textNode.value('Menu:');
                self.closeButton.disable();
            }
        })
    },
    destroy: (self) => {
    }
});
