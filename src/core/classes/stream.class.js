export class Subscription {
    constructor(stream, worker) {
        this.stream = stream;
        this.worker = worker;
    }

    unsubscribe() {
        this.stream.unsubscribe(this);
    }

    next(...args) {
        this.worker(...args);
    }
}

export class Stream {
    constructor() {
        this.subscriptions = [];
        this.data = null;
        this.lastArgs = [];
    }

    subscribe(worker) {
        let subscription = new Subscription(this, worker);
        this.subscriptions.push(subscription);
        return subscription
    }

    next(...args) {
        this.data = args;
        this.subscriptions.forEach(sbs => sbs.next(...args, ...this.lastArgs));
        this.lastArgs = args;
    }

    unsubscribe(subscription) {
        let ind = this.subscriptions.indexOf(subscription);

        if ( ind >= 0 ) {
            this.subscriptions.splice(ind, 1);
        }
    }
}

export class BehaviourStream extends Stream {
    constructor(data) {
        super();
        this.next(data);
    }

    subscribe(worker) {
        let subscription = super.subscribe(worker);
        subscription.next(...this.data);
        return subscription;
    }
}
