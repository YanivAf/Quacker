import { useState, useEffect, useContext, createRef } from 'react';
import '../Quacker.scss';

import { UserInfoStateI } from '../interfaces/statesI';
import { NewCredentialsStateI } from '../interfaces/statesI';
import QuackerContext from './quackerContext';

import swal from 'sweetalert';

const Profile:React.FC = (): JSX.Element => {
    const context = useContext(QuackerContext);
    const profilePicRef: any = createRef();
    const { userInfo, updateProfile } = context;
    const [userInfoInputs, setUserInputs] = useState<UserInfoStateI>(userInfo);
    const [newProfilePicUrl,  setNewProfilePicUrl] = useState<string>('');
    const [credentials, setCredentials] = useState<NewCredentialsStateI>({ email: userInfo.email, password: '', verifyPassword: '' });
    const [validPassword, setValidPassword] = useState<number>(-1); // -1: regEx faild; 0: verification failed; 1: success;
    const [alertMsg, setAlertMsg] = useState<string>('Your password must contain at least: 8 characters, 1 uppercase letter, 1 lowercase letter, 1 digit and 1 special character');

    const handleUserInfo = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(userInfoInputs.username, profilePicRef.current.files[0], credentials.password);
            setUserInputs(userInfoInputs);
            swal({
                title: `You got it, ${userInfoInputs.username}!`,
                icon: "success"
              });
        } catch (error) {
            swal({
                title: `Oops! Something went wrong`,
                icon: "warning"
              });
        }
    }

    const validatePassword = ({ password, verifyPassword }) => {
        const passRegExRule: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        // const passRegEx: RegExp = new RegExp(passRegExRule, "gm");  REGEX BUG! https://stackoverflow.com/questions/3891641/regex-test-only-works-every-other-time
        if (!(new RegExp(passRegExRule, "gm")).test(password)) return -1;
        if (password !== verifyPassword) return 0;
        return 1;
    }

    const handleUserName = (e) => {
        setUserInputs({ ...userInfoInputs, username: e.target.value });
    }

    const handleNewProfilePic = (e) =>{
        setNewProfilePicUrl(URL.createObjectURL(e.target.files[0]));
    }

      const handlePassword = (e) => {
        setCredentials({ ...credentials, password: e.target.value });
    }

    const handleVerifyPassword = (e) => {
        setCredentials({ ...credentials, verifyPassword: e.target.value });
    }

    useEffect(() => {
        if (!credentials.password) return;
        setValidPassword(validatePassword(credentials));
        if (validPassword !== 1) {
            setAlertMsg((validPassword) ?
                'Your password must contain at least: 8 characters, 1 uppercase letter, 1 lowercase letter, 1 digit and 1 special character'
                :
                'Please make sure you have entered the same password');
        }
    }, [credentials]);

    return (
        <main className="Quacker-main profile">
            <h1 className="Quacker-h1">Profile</h1>
            <form onSubmit={(e) => {handleUserInfo(e)}} className="profile-form">
                <label>User Name</label>
                <div className="profile-form__item profile-form__item--content">
                    <input type={'text'} minLength={2} maxLength={20} value={userInfoInputs.username} onChange={handleUserName} className="input-username" required />
                </div>
                <label>Profile Picture</label>
                {(userInfo.picUrl || newProfilePicUrl) &&
                <img
                alt={`${userInfo.username}'s profile pic`}
                src={newProfilePicUrl ? newProfilePicUrl : userInfo.picUrl}
                className='profile-img' />}
                <input type={'file'} accept='image/jpeg' ref={profilePicRef} onChange={handleNewProfilePic} className="input-username" />
                <label>Password</label>
                <div className="profile-form__item profile-form__item--content">
                    <input
                        type={'password'}
                        minLength={8}
                        value={credentials.password}
                        onChange={handlePassword}
                        className="input-password" />
                </div>
                <label>Verify Password</label>
                <div className="profile-form__item profile-form__item--content">
                    <input
                        type={'password'}
                        minLength={8}
                        value={credentials.verifyPassword}
                        onChange={handleVerifyPassword}
                        className="input-password"
                        required={credentials.password ? true : false} />
                </div>
                {(credentials.password && validPassword !== 1) && <span className='profile-form__item--alert'>{alertMsg}</span>}
                <div className="profile-form__item profile-form__item--submit">
                    <input
                    type={'submit'}
                    value={'Save'}
                    className='input-submit'
                    style={{bottom:'-60px'}}
                    disabled={(!credentials.email || (credentials.password && !credentials.verifyPassword) || (credentials.password && validPassword !== 1)) ? true : false} />
                </div>
            </form>
        </main>
    );
}

export default Profile;