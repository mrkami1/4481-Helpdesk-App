import React from 'react'

const Message = () => {
    return (
        <div className='message'>
            <div className="user-info">
                <img src="https://cdn-icons-png.flaticon.com/512/1177/1177568.png" alt="Icon" width={45} height={45}></img>
                <div className='name'>Joe Bob Man Guy</div>
                <div className='timestamp'>1/2/2023 12:30PM</div>
                
            </div>
            <div className="content">
                lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem 
                ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum 
                lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem 
                ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum 
                lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem 
                ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum 
                lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem 
                this is a test
            </div>
        </div>
    )
}

export default Message
