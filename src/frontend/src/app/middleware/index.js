export default function requestMiddleware() {
  return ({ dispatch, getState }) => next => action => {
   

    // Call the next dispatch method in the middleware chain.
    const returnValue = next(action)


    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue
  }
}