import React from 'react'
import { useState } from 'react'
import { auth, db } from '../firebase'
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {

    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const userStatus = 'online';

    async function updateAnonStatus(response) {
        const userType = 'anonymous';
        const userID = response.user.uid;
        
        await setDoc(doc(db, 'users', response.user.uid), {
            userID,
            userType,
            userStatus,
        });
    }

    async function updateStatus(response) {
        await updateDoc(doc(db, 'users', response.user.uid), {
            userStatus,
        });
    }

    const submit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            updateStatus(response);
            navigate('/')
        }
        catch (error) {
            console.log(error);
            setError(true);
        }
    }

    const submitAnon = async (e) => {
        e.preventDefault();
        try {
            await signInAnonymously(auth)
            .then((res) => {
                console.log(res);
                updateAnonStatus(res);
                navigate('/')
            })
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
                <span className='sub-title'>Sign in</span>
                <form onSubmit={submit}>
                    <input type='email' placeholder='Email'></input>
                    <input type='password' placeholder='Password'></input>
                    {error && <span style={{color: 'rgb(200,100,100)', fontSize: 14 + 'px', textAlign: 'center'}}>Invalid Email and or Password</span>}
                    <button type='submit'>Sign in</button>
                </form>
                <form onSubmit={submitAnon}>
                    <button className='anon-signin' type='submit'>Anonymously Sign in</button>
                </form>
                <Link className='signin-instead' to={'/register'}>Sign up instead</Link>
            </div>
        </div>
    )
}

export default Login
