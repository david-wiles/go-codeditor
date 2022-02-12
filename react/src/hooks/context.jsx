import React, {createContext, useReducer} from "react";

const initialState = {
  dir: '',
  client: null
};

const Reducer = (state, action) => {
  switch (action.type) {
    case 'SET_DIR':
      // Sets the directory for the finder. Won't affect any open files
      return {
        ...state,
        dir: action.payload
      }
    case 'SET_CLIENT':
      return {
        ...state,
        client: action.payload
      }
    default:
      return state;
  }
};

const Store = ({children}) => {
  return (
    <Context.Provider value={useReducer(Reducer, initialState)}>
      {children}
    </Context.Provider>
  );
};

export const Context = createContext(initialState);
export default Store;
