# API Middleware

- middleware lies between the action and reducer
- it listens for all dispatches and executes the code with the details of the action and return the current state
- middleware is a function that accepts the store, which is returns a function that accepts the next functions which return a function which accepts an action

```js
/*simplified view*/
const loggingMiddleware = (store) => (next) => (action) => {

}
```

```js
const loggingMiddleware = (props) => {
  return function(next) {

    return function (action) {

    }
  }
}
```

## Using Middleware in our React App

- to apply middleware to our stack, we use the "applyMiddleware" function as a third argument to the createStore() method
