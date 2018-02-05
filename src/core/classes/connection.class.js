import { EventManager } from './event-manager.class';

export class Connection {
    constructor(port) {
        this.ev = new EventManager();
        this.port = port || chrome.runtime.connect({name: "messages-stream"});

        this.port.onMessage.addListener((msg) => {
            // console.log({msg});
            if (msg.action) {
                this.ev.emit(msg.action, msg.data);
            }
        });
    }

    send(action, data) {
        this.port.postMessage({action, data});
    }
}
