import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import '../Quacker.scss';

import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

import QuackerContext from '../components/quackerContext'
import { NewCredentialsStateI } from '../interfaces/statesI';

import swal from 'sweetalert';


const SignUp:React.FC = (): JSX.Element => {
    const context = useContext(QuackerContext);
    const { signup } = context;
    const [credentials, setCredentials] = useState<NewCredentialsStateI>({ email: '', password: '', verifyPassword: '' });
    const [validPassword, setValidPassword] = useState<number>(-1); // -1: regEx faild; 0: verification failed; 1: success;
    const [alertMsg, setAlertMsg] = useState<string>('Your password must contain at least: 8 characters, 1 uppercase letter, 1 lowercase letter, 1 digit and 1 special character');
    
    const validatePassword = ({ password, verifyPassword }) => {
        const passRegExRule: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        // const passRegEx: RegExp = new RegExp(passRegExRule, "gm");  REGEX BUG! https://stackoverflow.com/questions/3891641/regex-test-only-works-every-other-time
        if (!(new RegExp(passRegExRule, "gm")).test(password)) return -1;
        if (password !== verifyPassword) return 0;
        return 1;
    }

    useEffect(() => {

        setValidPassword(validatePassword(credentials));
        if (validPassword !== 1) {
            setAlertMsg((validPassword) ?
                'Your password must contain at least: 8 characters, 1 uppercase letter, 1 lowercase letter, 1 digit and 1 special character'
                :
                'Please make sure you have entered the same password');
        }
    }, [credentials]);

    const handleSignUp = (e) => {
        e.preventDefault();
        if (validPassword !== 1) {
            setValidPassword(validatePassword(credentials));
            swal({
                title: 'Password Issue',
                text: alertMsg,
                icon: "warning",
                buttons: [false,"Try again"],
            });
            return;    
        }

        const { email, password } = credentials;
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            swal({
                title: `Welcome, quacker!`,
                icon: "success"
            });
            signup({
                username: 'quacker',
                email: user.email,
                picUrl: 'https://www.pngkit.com/png/full/301-3012742_solid-yellow-duck-clip-art-yellow-duck-silhouette.png'
            }, user.uid);
        })
        .catch((error) => {
            const errorMessage = error.message;
            swal({
                title: 'Sign Up Issue',
                text: errorMessage,
                icon: "warning",
                buttons: [false,"Try again"],
            });
        });
    }

    const handleGoogleSignUp = (e) => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            swal({
                title: `Welcome, ${user.displayName}!`,
                icon: "success"
            });
            console.log({
                username: user.displayName,
                email: user.email,
                picUrl: 'https://www.pngkit.com/png/full/301-3012742_solid-yellow-duck-clip-art-yellow-duck-silhouette.png'
            });
            signup({
                username: user.displayName,
                email: user.email,
                picUrl: 'https://www.pngkit.com/png/full/301-3012742_solid-yellow-duck-clip-art-yellow-duck-silhouette.png'
            }, user.uid);
            console.log(user);
        })
        .catch((error) => {
            const errorMessage = error.message;
            const email = error.email;
            swal({
                title: 'Sign Up Issue',
                text: `${email} - ${errorMessage}`,
                icon: "warning",
                buttons: [false,"Try again"],
            });
            console.error(errorMessage);
        });
    }

    const handleEmail = (e) => {
        setCredentials({ ...credentials, email: e.target.value });
    }

    const handlePassword = (e) => {
        setCredentials({ ...credentials, password: e.target.value });
    }

    const handleVerifyPassword = (e) => {
        setCredentials({ ...credentials, verifyPassword: e.target.value });
    }

    return (
        <main className="Quacker-main signup">
            <h1 className="Quacker-h1">Sign Up</h1>
            <button className='google-signin-button' onClick={handleGoogleSignUp}>
                <img
                src='https://developers.google.com/identity/images/g-logo.png'
                alt='sign up with google' />
                <p>Sign up with Google</p>
            </button>
            <p>or</p>
            <form onSubmit={(e) => {handleSignUp(e)}} className="signup-form">
                <label>Email</label>
                <div className="signup-form__item signup-form__item--content">
                    <input
                        type={'email'}
                        value={credentials.email}
                        onChange={handleEmail}
                        className="input-email"
                        required />
                </div>
                <label>Password</label>
                <div className="signup-form__item signup-form__item--content">
                    <input
                        type={'password'}
                        minLength={8}
                        value={credentials.password}
                        onChange={handlePassword}
                        className="input-password"
                        required />
                </div>
                <label>Verify Password</label>
                <div className="signup-form__item signup-form__item--content">
                    <input
                        type={'password'}
                        minLength={8}
                        value={credentials.verifyPassword}
                        onChange={handleVerifyPassword}
                        className="input-password"
                        required />
                </div>
                {(validPassword !== 1) && <span className='signup-form__item--alert'>{alertMsg}</span>}
                <div className="signup-form__item signup-form__item--submit">
                    <input
                        type={'submit'}
                        value={'Sign Up'}
                        className="input-submit"
                        disabled={!credentials.email || !credentials.password || !credentials.verifyPassword || validPassword !== 1} />
                </div>
            </form>
            <p>
                Already registered?{' '}<Link to="/login">Login</Link>
            </p>
        </main>
    );
}

export default SignUp;