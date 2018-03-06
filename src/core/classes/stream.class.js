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
        this.onFinish = [];
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

            if ( !this.subscriptions.length ) {
                this.onFinish.forEach(w => w());
            }
        }
    }

    _createStream(worker) {
        let stream = new Stream();
        let subscription = this.subscribe((...args) => worker(stream, args));
        stream.onFinish.push(() => subscription.unsubscribe());
        return stream;
    }

    filter(worker) {
        return this._createStream((stream, args) => {
            if ( worker(...args) ) {
                stream.next(...args);
            }
        });
    }

    map(worker) {
        return this._createStream((stream, args) => {
            stream.next(worker(...args));
        });
    }

    debounce(ts) {
        return this._createStream((stream, args) => {
            clearTimeout(stream._debounceLock);
            stream._debounceLock = setTimeout(() => stream.next(...args), (ts || 1));
        });
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
