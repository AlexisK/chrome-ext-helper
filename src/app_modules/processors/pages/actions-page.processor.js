import { Processor, DomEl } from 'core/classes';

export const ActionsPageProcessor = new Processor({
    name    : 'actions-page',
    init    : (self) => {
        let openInWindowButton = new DomEl('button')
            .value('Open as a tab')
            .attachTo(self.node)
            .addEventListener('click', ev => {
                chrome.tabs.create({ url: window.location.href });
            });
    }
});
