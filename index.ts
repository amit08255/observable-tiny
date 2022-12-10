class Observable<T> {
    private value:T;

    private subscribers:{[key:string]: (val:T) => any} = {};

    constructor(value:T = null) {
        this.value = value;
    }

    private broadcast() {
        Object.keys(this.subscribers).forEach(async (key) => {
            this.subscribers[key](this.value);
        });
    }

    next(value:T) {
        this.value = value;
        this.broadcast();
    }

    subscribe(func:(val:T) => any, isImmediate = false, key = 'main') {
        this.subscribers[key] = func;

        if (isImmediate) {
            func(this.value);
        }
    }

    unsubscribe(key = 'main') {
        delete this.subscribers[key];
    }

    dispose() {
        Object.keys(this.subscribers).forEach((key) => {
            this.unsubscribe(key);
        });
    }
}

export default Observable;
