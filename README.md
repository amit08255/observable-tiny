# Observable Tiny

Tiny observable for reactive programming in JavaScript and TypeScript without any dependencies.
It allows you to create a simple observable and add some subscribers to it. Whenever any updates happen on the observable it gets broadcasted to all subscribers.

## Create Observable

Default initial value of the observable is `null`. You can create the obsersable easily with some initial value in it:

```ts
const observable = new Observable<type>(initialValue);
```

**Example:**

```ts
const observable = new Observable<number>(0); // creating with initial value zero
```

## Adding Subscribers

You can add any number of subscribers for an observable. These are the callback functions which gets executed on every value update.

```ts
observable.subscribe({
  func: callbackFunction,
  isImmediate: boolean,
  key: string,
  before: beforeCallbackFunction,
  after: afterCallbackFunction,
});
```

* **func:** Subscriber callback function to execute on every update. The parameter passed to the function is value in observable.
* **before:** Callback function to execute before the subscriber callback function. Optional.
* **after:** Callback function to execute after the subscriber callback function. Optional.
* **isImmediate:** If the value is `true` the callback function is executed immediately with current value in observer.
* **key:** Key is used to make sure no duplicate subscriber is registered. Default key is `main` and every subscriber is registered with a key.

**Example:**

```ts
observable.subscribe({
  before: (val) => console.log("before: ", val),
  func: (val) => {
    console.log("val: ", val);
  },
  after: (val) => console.log("after: ", val),
  key: 'index',
});
```

## Updating Value

The `next` method allows you to update value in an observable. For every call to this method all subscriber function is executed.

```ts
observable.next(value);
```

**Example:**

```ts
observable.next(2);
```
