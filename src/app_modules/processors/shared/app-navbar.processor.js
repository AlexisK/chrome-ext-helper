import { Processor, DomEl } from 'core/classes';
import { clientStateService } from 'core/services';

export const AppNavbarProcessor = new Processor({
    name    : 'app-navbar',
    init    : (self, params) => {
        self.parentNode = new DomEl('div').cls('app-navbar').attachTo(self.node);

        self.menuButton = self.parentNode.cr('button').cls('app-navbar-button')
            .addEventListener('click', () => {})
            .cr('img').attr({src: './svg/menu-1.svg'});

        self.closeButton = self.parentNode.cr('button').cls('app-navbar-button right')
            .addEventListener('click', () => clientStateService.focusedApplication$.next(null));
        self.closeButton.cr('img').attr({src: './svg/error.svg'});
        self.expandButton = self.parentNode.cr('button').cls('app-navbar-button right')
            .addEventListener('click', () => {
                clientStateService.isMaximized$.next(!clientStateService.isMaximized$.data[0]);
            });
        self.expandButton.cr('img').attr({src: './svg/plus.svg'});

        self.textNode = self.parentNode.cr('div').cls('app-navbar-text');
    },
    process : (self) => {
        clientStateService.focusedApplication$.subscribe(app => {
            if ( app ) {
                self.textNode.value(app.title);
                self.closeButton.enable();
            } else {
                self.textNode.value('Menu:');
                self.closeButton.disable();
            }
        })
    },
    destroy: (self) => {
    }
});
