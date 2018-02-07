import { DomEl } from 'core/classes';

export class ModalService {

    createModal(text) {
        let bg = new DomEl('div').cls('fullscreen').attachTo(document.body);
        let body = bg.cr('div').cls('card modal');
        body.cr('strong').value(text);
        let actions = body.cr('div').cls('actions');

        return {
            close: () => bg.detach(),
            bg, body, actions
        }
    }

    confirm(question) {
        return new Promise((resolve, reject) => {
            let ctrl = this.createModal(question);

            ctrl.actions.cr('button').value('Confirm').addEventListener('click', () => {resolve(); ctrl.close() });
            ctrl.actions.cr('button').value('Cancel').addEventListener('click', () => {reject(); ctrl.close() });
        });
    }
}

export const modalService = new ModalService();

