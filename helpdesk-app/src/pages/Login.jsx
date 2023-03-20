import React from 'react'
import { useState } from 'react'
import { auth, db } from '../firebase'
import { doc, setDoc, updateDoc, where, query, collection, getDocs } from 'firebase/firestore';
import { signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {

    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState();
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

    async function assignAgent(res) {
        const q = query(collection(db, 'users'), where('userStatus', '==', 'online'), where('userType', '==', 'agent'));
        const agentsArray = [];
        console.log(res)
        await getDocs(q)
        .then((data) => {
            data.forEach((doc) => {
                agentsArray.push(doc.data());
            })      
        })
        .then(async () => {
            console.log(agentsArray)
            
            await updateDoc(doc(db, 'users', res.user.uid), {
                assignedAgent: agentsArray[0].userID,
            })
            await updateDoc(doc(db, 'users', agentsArray[0].userID), {
                assignedUser: res.user.uid,
            })
            
        })
        .then(() => {
            navigate('/')
        })
    }

    const submit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        if (email.length < 1 || password.length < 1) {
            setErrorMsg('Enter an email and password')
            setError(true);
            return;
        }

        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            updateStatus(response);
            navigate('/')
        }
        catch (error) {
            console.log(error);
            setErrorMsg('Invalid email/password or an error occurred')
            setError(true);
        }
    }

    const submitAnon = async (e) => {
        e.preventDefault();
        try {
            let response = null;
            await signInAnonymously(auth)
            .then((res) => {
                console.log(res);
                response = res;
                updateAnonStatus(res);
            })
            .then(() => {
                assignAgent(response);
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
                    {error && <span style={{color: 'rgb(200,100,100)', fontSize: 14 + 'px'}}>{errorMsg}</span>}
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
