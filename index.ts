type SubscriberOption<T> = {
    func:(val:T) => any,
    isImmediate?:boolean,
    key?:string,
    before?:(val:T) => any,
    after?:(val:T) => any,
};

class Observable<T> {
    private value:T;

    private subscribers:{[key:string]: (val:T) => any} = {};

    private beforeSubscribers:{[key:string]: (val:T) => any} = {};

    private afterSubscribers:{[key:string]: (val:T) => any} = {};

    constructor(value:T = null) {
        this.value = value;
    }

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

    next(value:T) {
        this.value = value;
        this.broadcast();
        return this;
    }

    subscribe({
        func, isImmediate, key, before, after,
    }:SubscriberOption<T>) {
        const subKey = key || 'main';
        this.subscribers[subKey] = func;

        this.beforeSubscribers[`${subKey}__before__`] = before || null;
        this.afterSubscribers[`${subKey}__after__`] = after || null;

        if (isImmediate && before) {
            before(this.value);
        }

        if (isImmediate) {
            func(this.value);
        }

        if (isImmediate && after) {
            after(this.value);
        }

        return this;
    }

    unsubscribe(key = 'main') {
        delete this.subscribers[key];
        delete this.beforeSubscribers[`${key}__before__`];
        delete this.afterSubscribers[`${key}__after__`];
        return this;
    }

    dispose() {
        Object.keys(this.subscribers).forEach((key) => {
            this.unsubscribe(key);
        });
    }
}

export default Observable;
