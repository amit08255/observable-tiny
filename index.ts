type SubscriberOption<T> = {
    func:(val:T) => any,
    isImmediate?:boolean,
    key?:string,
    before?:(val:T) => any,
    after?:(val:T) => any,
};

type PipedObservables<T> = {
    subscribe: (options:SubscriberOption<T>) => void,
    unsubscribe: (key?:string) => void,
    reset: () => void,
};

class Observables<T> {
    private initialValue:T;

    private value:T;

    private isBehaviorObservable:boolean;

    private subscribers:{[key:string]: (val:T) => any} = {};

    private beforeSubscribers:{[key:string]: (val:T) => any} = {};

    private afterSubscribers:{[key:string]: (val:T) => any} = {};

    constructor(value:T = null, isBehaviorObservable = false) {
        this.initialValue = value;
        this.value = value;
        this.isBehaviorObservable = isBehaviorObservable;
    }

    // Broadcast value update to all subscribers
    private broadcast() {
        Object.keys(this.subscribers).forEach(async (key) => {
            if (this.beforeSubscribers[`${key}__before__`]) {
                this.beforeSubscribers[`${key}__before__`](this.value);
            }

            this.subscribers[key](this.value);

            if (this.afterSubscribers[`${key}__after__`]) {
                this.afterSubscribers[`${key}__after__`](this.value);
            }
        });
    }

    // Trigger value update with new value
    next(value:T) {
        this.value = value;
        this.broadcast();
    }

    // register a subscriber
    subscribe({
        func, isImmediate = this.isBehaviorObservable, key = 'main', before, after,
    }:SubscriberOption<T>) {
        this.subscribers[key] = func;

        this.beforeSubscribers[`${key}__before__`] = before || null;
        this.afterSubscribers[`${key}__after__`] = after || null;

        if (isImmediate && before) {
            before(this.value);
        }

        if (isImmediate) {
            func(this.value);
        }

        if (isImmediate && after) {
            after(this.value);
        }
    }

    // unsubscribe subscriber by key
    unsubscribe(key = 'main') {
        delete this.subscribers[key];
        delete this.beforeSubscribers[`${key}__before__`];
        delete this.afterSubscribers[`${key}__after__`];
    }

    // reset observable to initial value
    reset() {
        this.next(this.initialValue);
    }

    // unsubscribe all subscribers
    dispose() {
        Object.keys(this.subscribers).forEach((key) => {
            this.unsubscribe(key);
        });
    }

    // send protected version of observable which only allows limited functionality
    pipe():PipedObservables<T> {
        return ({
            subscribe: this.subscribe.bind(this),
            unsubscribe: this.unsubscribe.bind(this),
            reset: this.reset.bind(this),
        });
    }
}

export default Observables;
