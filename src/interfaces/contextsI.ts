import QuackI from './quackI';
import QuacksUserI from './quacksUserI';
import UserInfoI from './userInfoI';

export interface QuackerContextI {
    quacks: QuackI[],
    myQuacks: QuackI[],
    quacksUsers: QuacksUserI[],
    quacksUserViewed: QuacksUserI,
    setQuacksUserViewed: any,
    quacksLimit: number,
    setQuacksLimit: any,
    myQuacksLimit: number,
    setMyQuacksLimit: any,
    whichQuacks: string,
    setWhichQuacks: any,
    showLikesOnly: boolean,
    setShowLikesOnly: any,
    searchString: string,
    setSearchString: any,
    byWhat: string,
    setByWhat: any,
    loading: boolean,
    badRequest: boolean,
    authProcessing: boolean,
    userInfo: UserInfoI,
    signup: any,
    signout: any,
    updateProfile: any
}