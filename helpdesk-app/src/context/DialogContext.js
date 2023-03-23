import { createContext, useState, useEffect, useContext, useReducer } from "react";

export const DialogContext = createContext();

export const DialogContextProvider = ({children}) => {
    
    const initial_state = false;

    const dialogReducer = (state, action) => {
        switch (action.type) {
            case 'show_dialog':
                return {
                    showDialog: action.payload
                };
            default: return state;
        }
    }

    const [state, dispatch] = useReducer(dialogReducer, initial_state);

    return (
        <DialogContext.Provider value={{ data: state, dispatch }}>
            {children}
        </DialogContext.Provider>
    );
}