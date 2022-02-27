import React, {createContext, useReducer} from "react";
import Client from "../Client";


const initialState = {
  dir: '',
  client: new Client(/* TODO credentials */)
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
    case 'SET_TREE':
      return {
        ...state,
        // tree will be a map formatted with each part of the path, such as...
        // {
        //   "<root>": {
        //     "isDir": true,
        //     "path": <root>,
        //     "name": <root basename>
        //     "subTree": {
        //       "<subPath>": {
        //         "isDir": true,
        //         "path": <root>/<subPath>,
        //         "name": <subPath>
        //         "subTree": {
        //           "<file>": {
        //             "isDir": false,
        //             "path": <root>/<subPath>/<file>,
        //             "name": <file>
        //           }
        //         }
        //       }
        //     }
        //   },
        // }
        tree: action.payload
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
