import React from 'react'

const Login = () => {
    return (
        <div className='register-container'>
            <div className='register-wrapper'>
                <span className='title'>Bolt</span>
                <span className='sub-title'>Sign in</span>
                <form>
                    <input type='text' placeholder='Username'></input>
                    <input type='password' placeholder='Password'></input>
                    <button type='submit'>Sign in</button>
                    <button className='anon-signin' type='submit'>Anonymously Sign in</button>
                </form>
                <p className='signin-instead'>Sign up instead</p>
            </div>
        </div>
    )
}

export default Login
