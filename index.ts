class Observable {
  private value;
  private subscribers = {};

  constructor(value) {
    this.value = value;
  }
  
  private broadcast() {
    Object.keys(this.subscribers).forEach(async (key) => {
      this.subscribers[key](this.value);
    });
  }
  
  next(value) {
    this.value = value;
    this.broadcast();
  }
  
  subscribe(func, isImmediate = false, key = 'main') {
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
