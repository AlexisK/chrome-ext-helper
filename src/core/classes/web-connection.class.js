import {EventManager} from "./event-manager.class";



export class WebConnection {
    constructor(server) {
        this.server = server;
        this.ev = new EventManager();

        let worker = (ev => {
            let msg = ev.data;
            console.log({msg});
            if (msg.action) {
                this.ev.emit(msg.action, msg.data);
            }
        });

        if ( this.server ) {
            this.server.onmessage = worker;
        } else {
            onmessage = worker; // man webworkers
        }
    }

    send(action, data) {
        if ( this.server ) {
            this.server.postMessage({action, data});
        } else {
            postMessage({action, data});
        }
    }
}
