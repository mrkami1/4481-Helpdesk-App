import React, { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile, browserSessionPersistence, setPersistence } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState();
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        const firstName = e.target[0].value;
        const lastName = e.target[1].value;
        const email = e.target[2].value;
        const password = e.target[3].value;
        const confirm = e.target[4].value;
        const userStatus = 'online';

        //Validate names
        const regex = /^[a-zA-Z]{1,50}$/
        const validFirst = regex.test(firstName);
        const validLast = regex.test(lastName);
        if (!validFirst || !validLast) {
            setError(true);
            setErrorMsg('First and last names must be 1-50 characters long and only contain letters');
            return;
        }

        //Validate password
        if (password !== confirm) {
            setError(true);
            setErrorMsg('Passwords must match');
            return;
        }
        else {
            const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*]).{8,20}$/
            const valid = regex.test(password);
            if (!valid) {
                setError(true);
                setErrorMsg('Passwords must be 8-20 characters long and contain at least one number, lower case, upper case, and special character (~!@#$%^&*)');
                return;
            }
        }

        try {
            setPersistence(auth, browserSessionPersistence)
            .then(async () => {
                const response = await createUserWithEmailAndPassword(auth, email, password);
                const userType = 'agent';
                const userID = response.user.uid;
                const assignedUsers = [];
                await setDoc(doc(db, 'users', response.user.uid), {
                    userID,
                    userType,
                    userStatus,
                    firstName,
                    lastName,
                    email,
                    assignedUsers,
                });

                await updateProfile(response.user, {
                    displayName: firstName + ' ' + lastName
                }).then((res) => {
                }).catch((error) => {
                    setError(true);
                    setErrorMsg('Profile update had an error');
                    return;
                })

                navigate('/login');
            })
            .catch((error) => {
                setError(true);
                setErrorMsg('Email already in use or there was an error');
                return;
            })
        }
        catch (error) {
            setError(true);
            setErrorMsg('Email already in use or there was an error');
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
                    <input type='password' placeholder='Confirm'></input>
                    <button type='submit'>Sign up</button>
                    {error && <span style={{color: 'rgb(200,100,100)', fontSize: 14 + 'px'}}>{errorMsg}</span>}
                </form>
                <Link className='signin-instead' to="/login">Sign in instead</Link>
                <Link className='signin-instead' to={'/privacy'}>Privacy</Link>
            </div>
        </div>
    )
}

export default Register
