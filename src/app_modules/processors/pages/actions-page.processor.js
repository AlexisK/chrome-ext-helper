import {Processor, DomEl} from 'core/classes';
import {authService} from 'core/services';

export const ActionsPageProcessor = new Processor({
    name: 'actions-page',
    init: (self) => {
        let settings = [
            ['Open as a tab', ev => {
                chrome.tabs.create({url: window.location.href});
            }],
            ['Logout', ev => authService.signOut()]
        ];
        self.container = new DomEl('div').cls('app-actions-page-container').attachTo(self.node);

        settings.forEach(([label, worker]) => self.container.cr('button')
            .cls('mat-button')
            .value(label)
            .addEventListener('click', worker)
        );
    }
});
