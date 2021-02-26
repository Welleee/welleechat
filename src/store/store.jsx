import React, { useReducer } from "react";

const makeStore = (reducer, initialState) => {
  const storeContext = React.createContext();
  const dispatchContext = React.createContext();

  const StoreProvider = ({ children }) => {
    const [store, dispatch] = useReducer(reducer, initialState);

    return (
      <dispatchContext.Provider value={dispatch}>
        <storeContext.Provider value={store}>{children}</storeContext.Provider>
      </dispatchContext.Provider>
    );
  };

  const useStore = () => {
    return React.useContext(storeContext);
  };

  const useDispatch = () => {
    return React.useContext(dispatchContext);
  };

  return [StoreProvider, useStore, useDispatch];
}

export default makeStore;