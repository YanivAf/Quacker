import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import '../Quacker.scss';

import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider  } from 'firebase/auth';

import QuackerContext from '../components/quackerContext'
import { CredentialsStateI } from '../interfaces/statesI';

import swal from 'sweetalert';


const Login:React.FC = (): JSX.Element => {
    const context = useContext(QuackerContext);
    const { signup } = context;
    const [credentials, setCredentials] = useState<CredentialsStateI>({ email: '', password: '' });
    
    useEffect(() => {
    }, []);
      
    const handleLogin = (e) => {
        e.preventDefault();
        const { email, password } = credentials;
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            swal({
                title: `Welcome back, ${(user.displayName) ? user.displayName : 'quacker'}!`,
                icon: "success"
            });
        })
        .catch((error) => {
            const errorMessage = error.message;
            swal({
                title: 'Login Issue',
                text: errorMessage,
                icon: "warning",
                buttons: [false,"Try again"],
            });
        });
    }

    const handleGoogleSignIn = (e) => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            swal({
                title: `Welcome, ${user.displayName}!`,
                icon: "success"
            });
            signup({
            }, user.uid);
        })
        .catch((error) => {
            const errorMessage = error.message;
            const email = error.email;
            swal({
                title: 'Sign In Issue',
                text: `${email} - ${errorMessage}`,
                icon: "warning",
                buttons: [false,"Try again"],
            });
        });
    }

    const handleEmail = (e) => {
        setCredentials({ ...credentials, email: e.target.value });
    }

    const handlePassword = (e) => {
        setCredentials({ ...credentials, password: e.target.value });
    }

    return (
        <main className="Quacker-main login">
            <h1 className="Quacker-h1">Login</h1>
            <button className='google-signin-button' onClick={handleGoogleSignIn}>
                <img src='https://developers.google.com/identity/images/g-logo.png' alt='sign in with google' />
                <p>Sign in with Google</p>
            </button>
            <p>or</p>
            <form onSubmit={(e) => {handleLogin(e)}} className="login-form">
                <label>Email</label>
                <div className="login-form__item login-form__item--content">
                    <input
                        type={'email'}
                        value={credentials.email}
                        onChange={handleEmail}
                        className="input-email"
                        required />
                </div>
                <label>Password</label>
                <div className="login-form__item login-form__item--content">
                    <input
                        type={'password'}
                        minLength={2} maxLength={20}
                        value={credentials.password}
                        onChange={handlePassword}
                        className="input-password"
                        required />
                </div>
                <div className="login-form__item login-form__item--submit">
                    <input
                        type={'submit'}
                        value={'Login'}
                        className="input-submit" />
                </div>
            </form>
            <p>Not registered?{' '}<Link to="/signup">Sign up</Link></p>
        </main>
    );
}

export default Login;