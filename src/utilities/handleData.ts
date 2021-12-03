import UserInfo from '../interfaces/userInfoI';

import axios from 'axios';
import localforage from 'localforage';

export const postQuackServer = async (newQuack) => {
    try {
        await axios.post('https://micro-blogging-dot-full-stack-course-services.ew.r.appspot.com/tweet', newQuack);
    } catch (error) {
        console.log('issues posting quack');
    }
}

export const getQuacksServer = async () => {
    try {
        const fetchedQuacks = await axios.get('https://micro-blogging-dot-full-stack-course-services.ew.r.appspot.com/tweet');
        return fetchedQuacks.data.tweets;
    } catch (error) {
        console.log('issues getting quacks');
    }
  }

export const postUsernameLocalForage = async (userInfo) => {
    try {
        await localforage.setItem('userInfo', userInfo);
    } catch (error) {
        console.log('issues posting username');
    }
}

export const getUsernameLocalForage = async () => {
    try {
        const fetchedUserInfo: UserInfo | null | undefined = await localforage.getItem('userInfo');
        return fetchedUserInfo;
    } catch (error) {
        console.log('issues getting username');
    }
}
