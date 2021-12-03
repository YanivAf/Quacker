import { createContext } from 'react';
import { QuackerContextI } from '../interfaces/contextsI';

const QuackerContext = createContext<QuackerContextI>({
    quacks: [],
    myQuacks: [],
    quacksUsers: [],
    quacksUserViewed: { username: '', picUrl: 'https://www.pngkit.com/png/full/301-3012742_solid-yellow-duck-clip-art-yellow-duck-silhouette.png', id: '' },
    setQuacksUserViewed: null,
    quacksLimit: 10,
    setQuacksLimit: null,
    myQuacksLimit: 10,
    setMyQuacksLimit: null,
    whichQuacks: 'All',
    setWhichQuacks: null,
    showLikesOnly: false,
    setShowLikesOnly: null,
    searchString: '',
    setSearchString: null,
    byWhat: 'byQuack',
    setByWhat: null,
    loading: false,
    badRequest: false,
    authProcessing: false,
    userInfo: { username: '', email: '', picUrl: 'https://www.pngkit.com/png/full/301-3012742_solid-yellow-duck-clip-art-yellow-duck-silhouette.png', id: '' },
    signup: null,
    signout: null,
    updateProfile: null
});

export default QuackerContext;