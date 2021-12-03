import { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import './Quacker.scss';

import { getFirestore, collection, doc, setDoc, onSnapshot, query, where, limit, orderBy, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, updatePassword } from 'firebase/auth';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { FirebaseContext } from './utilities/firebase';

import Loader from './components/loader';
import NavBar from './components/navBar';
import Login from './components/login';
import SignUp from './components/signUp';
import Home from './components/home';
import Profile from './components/profile';
import ProfileView from './components/profileView';
import QuackerContext from './components/quackerContext';
import QuackI from './interfaces/quackI';
import QuacksUserI from './interfaces/quacksUserI';
import { UserInfoStateI } from './interfaces/statesI';

const ContextWrapper:React.FC = (props): JSX.Element => {
  const [quacks, setQuacks] = useState<QuackI[]>([]);
  const [myQuacks, setMyQuacks] = useState<QuackI[]>([]);
  const [quacksUsers, setQuacksUsers] = useState<QuacksUserI[]>([]);
  const [quacksUserViewed, setQuacksUserViewed] = useState<QuacksUserI>({ username: '', picUrl: 'https://www.pngkit.com/png/full/301-3012742_solid-yellow-duck-clip-art-yellow-duck-silhouette.png', id: ''});
  const [quacksLimit, setQuacksLimit] = useState<number>(10);
  const [myQuacksLimit, setMyQuacksLimit] = useState<number>(10);
  const [whichQuacks, setWhichQuacks] = useState<string>('All');
  const [showLikesOnly, setShowLikesOnly] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>('');
  const [byWhat, setByWhat] = useState<string>('byQuack');
  const [loading, setLoading] = useState<boolean>(true);
  const [badRequest, setBadRequest] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfoStateI>({ username: '', email: '', picUrl: 'https://www.pngkit.com/png/full/301-3012742_solid-yellow-duck-clip-art-yellow-duck-silhouette.png', id: '' });
  const [authProcessing, setAuthProcessing] = useState<boolean>(false);
  
  const firebase = useContext(FirebaseContext);
  const db = getFirestore(firebase);
  const storage = getStorage();

  const signout = () => {
    setUserInfo({ username: '', email: '', picUrl: '', id: '' });
    setQuacks([]);
    setMyQuacks([]);
    setQuacksLimit(10);
    setMyQuacksLimit(10);
    setWhichQuacks('All');
    setShowLikesOnly(false);
    setSearchString('');
    setByWhat('byQuack');
  }
  
  const signup = async (signedUserInfo, signedUserId) => {
    try {
      await setDoc(doc(db, 'users', signedUserId), signedUserInfo, { merge: true });
    } catch (error) {
      console.error("Error adding document: ", error);
    }      
  }

  const updateProfile = async (username, profilePic, password) => {
    try {
      if (password) {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) updatePassword(user, password).then(() => {
          // Update successful.
        }).catch((error) => {
          console.error("Error updating password: ", error);
        });
      }

      const profilePicStorageRef = ref(storage, `profile_pics/${userInfo.id}.jpg`);
      const userInfoRef = doc(db, 'users', userInfo.id);
      if (profilePic)
      uploadBytes(profilePicStorageRef, profilePic).then((snapshot) => {
        getDownloadURL(profilePicStorageRef).then( async (url) =>
          await updateDoc(userInfoRef, { username: username, picUrl: url }));
      });
      else await updateDoc(userInfoRef, { username: username });
    } catch (error) {
        console.error("Error updating profile: ", error);
    }      
  }

  const getQuacks = () => {
    const updateQuacksState = (snapShot) => {
      const quacksResults: QuackI[] = [];
      try {
        snapShot.forEach((doc) => quacksResults.push({ id: doc.id, ...doc.data() }));
        (whichQuacks === 'All') ? setQuacks(quacksResults) : setMyQuacks(quacksResults);
      } catch (error) {
        setBadRequest(true);
      }
    }

    const q = (whichQuacks === 'All') ?
      query(collection(db, 'quacks'), orderBy('date', 'desc'), limit(quacksLimit))
      :
      query(collection(db, 'quacks'), orderBy('date', 'desc'), where('userId', '==', userInfo.id), limit(myQuacksLimit));
    const unsub = onSnapshot(q, (querySnapshot) => {
      updateQuacksState(querySnapshot);
    });
    (whichQuacks === 'All') ? getQuacksUsers() : setLoading(false);
    return () => {
        unsub();
    }
  }

  const getQuacksUsers = () => {
    const updateUsersState = (snapShot) => {
      const usersResults: QuacksUserI[] = [];
      try {
        snapShot.forEach((doc) => usersResults.push({ id: doc.id, username: doc.data().username, picUrl: doc.data().picUrl }));
        setQuacksUsers(usersResults);
        setLoading(false);
      } catch (error) {
        setBadRequest(true);
      }
    }

    const q = query(collection(db, 'users'));
    const unsub = onSnapshot(q, (querySnapshot) => {
      updateUsersState(querySnapshot)
    });
    return () => {
        unsub();
    }
  }

  useEffect(() => {
    if (whichQuacks === 'My') setByWhat('byQuack');
    if (((quacks.length === quacksLimit) || (quacks.length % 10)) && ((myQuacks.length === myQuacksLimit) || (myQuacks.length % 10))) return;
    if (userInfo.id) {
      setLoading(true);
      getQuacks();
    }
  }, [quacksLimit, myQuacksLimit, whichQuacks]);

  useEffect(() => {
    if (userInfo.id) getQuacks();
  }, [userInfo]);

  useEffect(() => {
    setAuthProcessing(true);
    const auth = getAuth();
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setAuthProcessing(false);
      try {
        if (user) {
          const updateUserInfoState = (snapShot) => {
            try {
              setUserInfo({ id:snapShot.id, ...snapShot.data() });
            } catch (error) {
              setBadRequest(true);
            }
          }

          const d = doc(db, 'users', user.uid);
          const unsub = onSnapshot(d, (doc) => updateUserInfoState(doc));
          return () => unsub();
        }
      } catch (error) {
        setBadRequest(true);
      }
    });
    return () => unsubAuth();
  }, []);

  return (
    <QuackerContext.Provider value={{ 
      quacks,
      myQuacks,
      quacksUsers,
      quacksUserViewed,
      setQuacksUserViewed,
      quacksLimit,
      setQuacksLimit,
      myQuacksLimit,
      setMyQuacksLimit,
      whichQuacks,
      setWhichQuacks,
      showLikesOnly,
      setShowLikesOnly,
      searchString,
      setSearchString,
      byWhat,
      setByWhat,
      loading,
      badRequest,
      authProcessing,
      userInfo,
      signup,
      signout,
      updateProfile }}>
      {props.children}
    </QuackerContext.Provider>
  );
}

const QuackerRoutes:React.FC = (): JSX.Element => {
  const context = useContext(QuackerContext);
  const { authProcessing, userInfo } = context;

  return (
    <>
    {authProcessing ?
      <Loader /> :
      (userInfo.id ?
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/profile-view/*' element={<ProfileView />} />
        <Route path='/login' element={<Navigate to='/' />} />
        <Route path='/signup' element={<Navigate to='/profile' />} />
        <Route path='*' element={<p>Ummm... We didn't find what you were looking for. Go to {<Link to='/'>home</Link>}</p>} />
      </Routes>
      :
      <Routes>
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='*' element={<p>Ummm... We didn't find what you were looking for. Go to {<Link to='/login'>sign in</Link>}</p>} />
      </Routes>
      )}
    </>
    );
}

const Quacker:React.FC = (): JSX.Element => {
  const context = useContext(QuackerContext);
  const { whichQuacks } = context;

  return (
    <ContextWrapper>
      <div className={`Quacker Quacker--${whichQuacks}`}>
        <NavBar />
        <QuackerRoutes />
        <footer className="Quacker-footer">
          <p>© all rights reserved to <a className="Quacker-link" href="https://www.linkedin.com/in/yaniv-aflalo-8aa92386/" target="_blank" rel="noreferrer">Yaniv Aflalo</a>, full stack developer</p>
        </footer>
      </div>
    </ContextWrapper>
  );
}

export default Quacker;