import React from 'react'
import Message from './Message'

const Chatbox = () => {
    return (
        <div className='chatbox-container'>
            <div className='message-wrapper'>
                <Message></Message>
                <Message></Message>
                <Message></Message>
                <Message></Message>
                <Message></Message>
                <Message></Message>
                <Message></Message>
                <Message></Message>
                
            </div>
            <div className='chatbox-input'>
                <input type="text" placeholder='Type a message'></input>
                <button>Send</button>
            </div>
        </div>
        
    )
}

export default Chatbox
