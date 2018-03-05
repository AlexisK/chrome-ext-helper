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

        settings.forEach(([label, worker]) => new DomEl('button')
            .attachTo(self.node)
            .cls('mat-button')
            .value(label)
            .addEventListener('click', worker)
        );
    }
});
