import { EventManager } from './event-manager.class';

export class Connection {
    constructor(port) {
        this.ev = new EventManager();
        this.isRaw = false;
        try {
            this.port = port || chrome.runtime.connect({name: "messages-stream"});

            this.port.onMessage.addListener((msg) => {
                // console.log({msg});
                if (msg.action) {
                    this.ev.emit(msg.action, msg.data);
                }
            });

            this.port.onDisconnect.addListener(() => this.ev.emit('disconnect'));
        } catch(err) {
            // Not an extention
            this.isRaw = true;
        }

    }

    send(action, data) {
        if ( this.isRaw ) {
            this.ev.emit(action, data);
        } else {
            this.port.postMessage({action, data});
        }
    }
}
