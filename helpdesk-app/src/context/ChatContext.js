import { onAuthStateChanged } from "firebase/auth";
import { createContext, useState, useEffect, useReducer, useContext } from "react";
import { auth } from "../firebase";
import { AuthContext } from '../context/AuthContext'

export const ChatContext = createContext();

export const ChatContextProvider = ({children}) => {
    
    const {currentUser} = useContext(AuthContext);

    const initial_state = {
        chatID: 'null',
        user: {}
    }

    const chatReducer = (state, action) => {
        switch (action.type) {
            case 'change_user':
                return {
                    user: action.payload,
                    chatID: currentUser.uid > action.payload.userID ? currentUser.uid + action.payload.userID : action.payload.userID + currentUser.uid,
                };
            default: return state;
        }
    }

    const [state, dispatch] = useReducer(chatReducer, initial_state);

    return (
        <ChatContext.Provider value={{ data: state, dispatch }}>
            {children}
        </ChatContext.Provider>
    );
}