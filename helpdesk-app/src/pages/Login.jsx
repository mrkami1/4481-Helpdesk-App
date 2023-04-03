import React from 'react'
import { useState } from 'react'
import { auth, db } from '../firebase'
import { doc, setDoc, updateDoc, where, query, collection, getDocs } from 'firebase/firestore';
import { browserSessionPersistence, setPersistence, signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {

    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState();
    const navigate = useNavigate();
    const userStatus = 'online';
    const assignedAgent = '';

    async function updateAnonStatus(response) {
        const userType = 'anonymous';
        const userID = response.user.uid;
        
        await setDoc(doc(db, 'users', response.user.uid), {
            userID,
            userType,
            userStatus,
            assignedAgent,
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
        await getDocs(q)
        .then((data) => {
            data.forEach((doc) => {
                agentsArray.push(doc.data());
            })      
        })
        .then(async () => {
            if (agentsArray.length > 0) {
                let agentLeastUsers = agentsArray[0];
                for (let i = 0; i < agentsArray.length; i++) {
                    if (agentsArray[i].assignedUsers.length < agentLeastUsers.assignedUsers.length) {
                        agentLeastUsers = agentsArray[i];
                    }
                }
                agentLeastUsers.assignedUsers.push(res.user.uid)
                await updateDoc(doc(db, 'users', res.user.uid), {
                    assignedAgent: agentsArray[0].userID,
                })
                await updateDoc(doc(db, 'users', agentLeastUsers.userID), {
                    assignedUsers: agentLeastUsers.assignedUsers,
                })
            }
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
            setPersistence(auth, browserSessionPersistence)
            .then(async () => {
                const response = await signInWithEmailAndPassword(auth, email, password);
                updateStatus(response);
                navigate('/');
            })
            .catch((error) => {
                setErrorMsg('Invalid email/password or an error occurred')
                setError(true);
                return;
            })
            
        }
        catch (error) {
            setErrorMsg('Invalid email/password or an error occurred')
            setError(true);
        }
    }

    const submitAnon = async (e) => {
        e.preventDefault();
        try {
            let response = null;
            setPersistence(auth, browserSessionPersistence)
            .then(async () => {
                await signInAnonymously(auth)
                .then((res) => {
                    response = res;
                    updateAnonStatus(res);
                })
                .then(() => {
                    assignAgent(response);
                })
            })
            .catch((error) => {
                setErrorMsg('Invalid email/password or an error occurred')
                setError(true);
                return;
            })
        }
        catch (error) {
            setErrorMsg('Invalid email/password or an error occurred')
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
                <Link className='signin-instead' to={'/privacy'}>Privacy</Link>
            </div>
        </div>
    )
}

export default Login
