import React from 'react';
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { FirebaseContext } from '../utilities/firebase';

import QuacksUser from '../interfaces/quacksUserI';
import QuackerContext from './quackerContext';

import formatDate from '../utilities/fromatDate';

interface Props {
    quacksUser: QuacksUser | undefined;
    content: string;
    likes: string[];
    index: number;
    date: Date;
    updatedAt: Date | null;
    onDelete: (index: number) => void;
    onOpenModal: (eTarget: EventTarget, index: number) => void;
    id: string;
}

const Quack:React.FC<Props> = ( { quacksUser, content, likes, index, date, updatedAt, onDelete, onOpenModal, id }: Props): JSX.Element => {
    const context = useContext(QuackerContext);
    const { userInfo, setQuacksUserViewed } = context;
    
    const firebase = useContext(FirebaseContext);
    const db = getFirestore(firebase);
    const [liked, setLiked] = useState<boolean>(likes.find(likeUserId => userInfo.id === likeUserId) ? true : false);
    const [likeEffect, setLikeEffect] = useState<string>('');

    const relative: boolean = true;
    const createdFormattedDate: string = formatDate(date, false, relative);
    const updatedFormattedDate: string = (updatedAt) ? formatDate(updatedAt, false, relative) : '';
    const createdClass: string = (updatedAt) ? 'date' : 'username';

    const handleLike = async () => {
        try {
            setLiked(!liked);
            if (!liked) setLikeEffect('rotate-scale-up-diag-1');
            else setLikeEffect('');
            const newQuackLikes = (liked) ? { likes: likes.filter(likeUserId => userInfo.id !== likeUserId) } : { likes: [...likes, userInfo.id] }
            await updateDoc(doc(db, "quacks", id), newQuackLikes);
        } catch (e) {
            console.error("Error updating likes in document: ", e);
        }      
    }

    return (
        <div className='quack' onClick={(e) => {if (quacksUser?.id === userInfo.id) onOpenModal(e.target, index)}}>
            {quacksUser ?
            <div className={`quack__item quack__item--top`}>
                <img className='quack__item quack__item--pic'
                src={quacksUser?.picUrl}
                alt={`${quacksUser.username}'s profile pic'`} />
                <Link
                to={`/profile-view/${quacksUser.username}`}
                className='quack__item quack__item--username'
                onClick={() => setQuacksUserViewed(quacksUser)}>
                    {quacksUser.username}
                </Link>
                {updatedAt && <span className='quack__item quack__item--date'>updated{relative ? ' ' : `:${<br />}`}{updatedFormattedDate}</span>}
                <span className='quack__item quack__item--date'>created{relative ? ' ' : `:${<br />}`}{createdFormattedDate}</span>
                {(quacksUser?.id === userInfo.id) && <span className={`quack__item quack__item--close`} onClick={() => onDelete(index)}><i className='fas fa-trash'></i></span>}
            </div>
            :
            <div className={`quack__item quack__item--top`}>
                {updatedAt && <span className='quack__item quack__item--username'>updated{relative ? ' ' : `:${<br />}`}{updatedFormattedDate}</span>}
                <span className={`quack__item quack__item--${createdClass}`}>created{relative ? ' ' : `:${<br />}`}{createdFormattedDate}</span>
            </div>
            }
            <p className='quack__item quack__item--content'>{content}</p>
            <div className={`quack__item quack__item--buttons`}>
                <button className={`quack__item quack__item--like`}>
                    <i
                    className={`fa${liked ? 's' : 'r'} fa-thumbs-up ${likeEffect}`}
                    title={liked ? 'You liked this quack' : 'Like'}
                    onClick={handleLike}></i>
                </button>
                <span>{likes.length && `${likes.length} likes`}</span>
            </div>

        </div>
    );
}

export default Quack;