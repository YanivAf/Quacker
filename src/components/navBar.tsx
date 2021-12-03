import React from 'react'
import { useContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import '../Quacker.scss';

import { getAuth, signOut } from "firebase/auth";

import QuackerContext from './quackerContext';

const NavBar:React.FC = (): JSX.Element => {
    const context = useContext(QuackerContext);
    const { userInfo, signout, whichQuacks, setWhichQuacks, showLikesOnly, setShowLikesOnly, searchString, setSearchString, byWhat, setByWhat } = context;

    const handleSignOut = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            signout();
        }).catch((error) => {
            console.error('error signing out: ', error);
        });
    }

    return (
        <nav className="nav-bar">
            <ul>
            {userInfo.id ?
            <>
                <li>
                    <Link to="/">
                        <img
                        src={"https://www.pngkit.com/png/full/301-3012742_solid-yellow-duck-clip-art-yellow-duck-silhouette.png"}
                        className='nav-logo'
                        alt={'Quacker'}
                        title={'Home'} />
                    </Link>
                </li>
                <li>
                    <Link to="/profile" className='profile-link'>
                        <img src={userInfo.picUrl}
                        className='nav-profile-pic'
                        alt={`${userInfo.username}'s profile pic`}
                        title={`${userInfo.username}'s Profile`}/>
                        <span>{userInfo.username}</span>
                    </Link>
                </li>
                <Routes>
                    <Route path="/profile" element={<></>} />
                    <Route path="/" element={
                    <>
                        <li>
                            <button
                            className={`quacks-picker quacks-picker--${whichQuacks}`}
                            onClick={() => {setWhichQuacks((whichQuacks === 'My') ? 'All' : 'My')}}
                            title={'Mine/All'}>
                                <div>
                                    <img
                                    src={"https://www.pngall.com/wp-content/uploads/11/Rubber-Duck-PNG-Free-Image.png"}
                                    alt={'Quacks Picker'}
                                    className="picker-left" />
                                    <img
                                    src={"https://www.pngall.com/wp-content/uploads/11/Rubber-Duck-PNG-Free-Image.png"}
                                    alt={'Quacks Picker'}
                                    />
                                    <img
                                    src={"https://www.pngall.com/wp-content/uploads/11/Rubber-Duck-PNG-Free-Image.png"}
                                    alt={'Quacks Picker'}
                                    className="picker-right" />
                                </div>
                                <span>{whichQuacks} Quacks</span>
                            </button>
                        </li>
                        <li>
                        <button className={`likes-button `}>
                            <i
                            className={`fas fa-thumbs-up ${showLikesOnly}`}
                            title={'Likes/All'}
                            onClick={() => {console.log(showLikesOnly); setShowLikesOnly((showLikesOnly) ? false : true)}}></i>
                        </button>
                        </li>
                        <li>
                            <div className='search'>
                                <input
                                className='search-input'
                                type='search'
                                placeholder='Search Quacks'
                                value={searchString}
                                onChange={(e) => {setSearchString(e.target.value)}} />
                                {(whichQuacks === 'All') &&
                                <div>
                                    <input
                                    type='radio'
                                    value='by quack'
                                    id='byQuack'
                                    name='byWhat'
                                    checked={(byWhat === 'byQuack')}
                                    onChange={() => {setByWhat('byQuack')}} />
                                    <label htmlFor='byQuack'>by quack</label>
                                    <input
                                    type='radio'
                                    value='by user'
                                    id='byUser'
                                    name='byWhat'
                                    checked={(byWhat === 'byUser')}
                                    onChange={() => {setByWhat('byUser')}} />
                                    <label htmlFor='byUser'>by user</label>
                                </div>
                                }
                            </div>
                        </li>
                    </>} />
                </Routes>
            </>
            :
                <li>
                    <Link to="/login">Sign In</Link>
                </li>}
            </ul>
            <ul>
            {userInfo.id &&
                <li>
                    <button className="signout-button" onClick={handleSignOut}>Sign Out</button>
                </li>}
            </ul>
        </nav>
    );
}

export default NavBar;