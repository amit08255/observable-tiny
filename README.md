# Observable Tiny

Tiny observable for reactive programming in JavaScript and TypeScript without any dependencies.
It allows you to create a simple observable and add some subscribers to it. Whenever any updates happen on the observable it gets broadcasted to all subscribers.

## Creating Observable

Default initial value of the observable is `null`. You can create the obsersable easily with some initial value in it:

```ts
const observable = new Observables<type>(initialValue, isBehaviorObservable);
```

Second parameter `isBehaviorObservable` is a boolean value whose default value is `false`. Behavior observable means that whenever a subscriber is registered it is executed immediately with current observable value.

**Example:**

```ts
const observable = new Observables<number>(0); // creating with initial value zero
```

**Example 2:**

```ts
const observable = new Observables<number>(0, true); // creating behavior observable with initial value zero
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
* **before:** Callback function to execute before the subscriber callback function. **Optional**.
* **after:** Callback function to execute after the subscriber callback function. **Optional**.
* **isImmediate:** If the value is `true` the callback function is executed immediately with current value in observer. `isBehaviorObservable` is the default value of this option. Setting this value will override the behavior of `isBehaviorObservable` option set during initialization. **Optional**.
* **key:** Key is used to make sure no duplicate subscriber is registered. Default key is `main` and every subscriber is registered with a key. **Optional**.

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

## Unsubscribing Subscribers By Key

Removing subscribers from observable is very easy using `unsubscribe` method. It has an optional parameter key whose default value is `main`.

```ts
observable.unsubscribe(key);
```

**Example:**

```ts
observable.unsubscribe('index');
```

## Unsubscribing All Subscribers

The `dispose` method allows you to remove all subscribers from observables.

```ts
observable.dispose();
```

## Resetting Observable

The `reset` method allows you to reset value of observable to the passed initial value.

```ts
observable.reset();
```

## Getting Protected Observable

The `pipe` method allows you to get protected version of observable which does not allows changing values except reset functionality. It provides only these methods: `subscribe`, `unsubscribe` and `reset`.

```ts
observable.pipe();
```
