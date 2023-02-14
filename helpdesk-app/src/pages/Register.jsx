import React from 'react'

const Register = () => {
    return (
        <div className='register-container'>
            <div className='register-wrapper'>
                <span className='title'>Bolt</span>
                <span className='sub-title'>Create Account</span>
                <form>
                    <input type='text' placeholder='First Name'></input>
                    <input type='text' placeholder='Last Name'></input>
                    <input type='text' placeholder='Username'></input>
                    <input type='password' placeholder='Password'></input>
                    <input type='password' placeholder='Confirm Password'></input>
                    <button type='submit'>Sign up</button>
                </form>
                <p className='signin-instead'>Sign in instead</p>
            </div>
        </div>
    )
}

export default Register
