import React, { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        const firstName = e.target[0].value;
        const lastName = e.target[1].value;
        const email = e.target[2].value;
        const password = e.target[3].value;
        const confirm = e.target[4].value;
        const userStatus = 'online';

        if (password !== confirm) {
            setError(true);
            return;
        }

        try {
            const response = await createUserWithEmailAndPassword(auth, email, password)
            console.log(response);
            const userType = 'agent';
            const userID = response.user.uid;
            await setDoc(doc(db, 'users', response.user.uid), {
                userID,
                userType,
                userStatus,
                firstName,
                lastName,
                email,
            });

            await updateProfile(response.user, {
                displayName: firstName + ' ' + lastName
            }).then((res) => {
                console.log(res);
            }).catch((error) => {
                console.log(error);
            })

            navigate('/');
        }
        catch (error) {
            console.log(error);
            setError(true);
        }
    }

    return (
        <div className='register-container'>
            <div className='register-wrapper'>
                <span className='title'>Help Desk</span>
                <span className='sub-title'>Create Account</span>
                <form onSubmit={submit}>
                    <input type='text' placeholder='First Name'></input>
                    <input type='text' placeholder='Last Name'></input>
                    <input type='email' placeholder='Email'></input>
                    <input type='password' placeholder='Password'></input>
                    <input type='password' placeholder='Confirm Password'></input>
                    <button type='submit'>Sign up</button>
                    {error && <span style={{color: 'rgb(200,100,100)', fontSize: 14 + 'px', textAlign: 'center'}}>Invalid credentials</span>}
                </form>
                <Link className='signin-instead' to="/login">Sign in instead</Link>
            </div>
        </div>
    )
}

export default Register
