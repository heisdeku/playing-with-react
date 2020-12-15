import { createStore, applyMiddleware } from 'redux'
import { rootReducer, initialState } from './reducers'

const loggingMiddleware = (store) => (next) => (action) => {
  console.log(`Redux Log:`, action)
}

const apiMiddleware = store => next => action => {
  if (!action.meta || action.meta.type !== "api") {
    return next(action)
  }
}

export const configureStore = () => {
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      apiMiddleware,
      loggingMiddleware
    )
  )

  return store;
}