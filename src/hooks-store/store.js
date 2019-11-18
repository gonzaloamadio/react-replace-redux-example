import { useState, useEffect } from 'react';

// We define this outside the custoom useStore hook. So it is not recreated
// each time. Is created only once when this file is imported.
// Also IMPORTANT, every file will share this data.
// With this, we are sharing logic and data. Not only logic.
let globalState = {};
// Listeners should be a list of all functions that i can call to update all
// components that are using my hook. See the for loop down here to understand this.
let listeners = [];
// Then we will define concrete usages of the store  with their own actions.
let actions = {};

// With custom hook, we share logic. And with variables defined outside we share data.
// shouldListen, to optimize, if we want to register a listener or not. For example
// if we have a component that only dispatchs, we do not want to render on state changes.
export const useStore = (shouldListen = true) => {

  // We are only interested in setState, because this will make the component that uses
  // this hook, to re-render.
  const setState = useState(globalState)[1];

  // We need to dispatch actions to change our state (same as redux)
  // actionidentifier will be something like 'TOGGLE_FAV', that uniques identifies the action to dispatch
  const dispatch = (actionIdentifier, payload) => {
    // Acces action objects, on the actionidentifier key. That will be a function
    // that takes the state and payload. And returns a new state (same as redux)
    const newState = actions[actionIdentifier](globalState, payload);
    globalState = { ...globalState, ...newState };

    // Call all setState in listeners, that will be all concrete listeners of each component
    // that uses this hook. That will cause every component re-render
    for (const listener of listeners) {
      listener(globalState);
    }
  };

  useEffect(() => {
    // Push a pointer of setState to listeners. That means that every component that uses this hook
    // will get its own setState function, that is then added to the listeners array.
    // So more components will add, the bigger is listeners.
    // We register one listener per component.
    if (shouldListen) {
      listeners.push(setState);
    }

    // Clean that setState pointer of listeners when component is unmounted.
    return () => {
      if (shouldListen) {
        listeners = listeners.filter(li => li !== setState);
      }
    };
  }, [setState, shouldListen]);

  return [globalState, dispatch];
};

// We initialize our store, and we can call multiple times. Because we do not replace our state. We merge.
// So we can create concrete store slices.
export const initStore = (userActions, initialState) => {
  if (initialState) {
    // We merge global state with this concrete instanciation.
    // Like combine reducers, to create one big store.
    globalState = { ...globalState, ...initialState };
  }
  actions = { ...actions, ...userActions };
};
