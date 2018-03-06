import { Stream, BehaviourStream } from 'core/classes';

export class ClientStateService {
    constructor() {
        this.user$ = new Stream();
        this.isAuthorized$ = new BehaviourStream(false);
        this.focusedApplication$ = new BehaviourStream(null);
        this.runningApplications$ = new BehaviourStream([]);
        this.isMaximized$ = new BehaviourStream(false);
    }
}

export const clientStateService = new ClientStateService();
