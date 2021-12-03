import { useState, useEffect, useContext } from 'react';

import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { FirebaseContext } from '../utilities/firebase';

import QuackI from '../interfaces/quackI';
import { QuackInputsStateI } from '../interfaces/statesI';
import QuackerContext from './quackerContext';

import { v4 as uuidv4 } from 'uuid';

interface Props {
    existingQuack: QuackI | null;
    onUpdate: ((quack: QuackI) => Promise<void>) | null;
}
  
const QuackForm:React.FC<Props> = ( { existingQuack, onUpdate }: Props): JSX.Element => {
    const quackerContext = useContext(QuackerContext);
    const { loading, userInfo } = quackerContext;
    const [quackInputs, setQuackInputs] = useState<QuackInputsStateI>(existingQuack ? { content: existingQuack.content } : { content: '' });
    const [sent, setSent] = useState<boolean>(true);
  
    const firebase = useContext(FirebaseContext);
    const db = getFirestore(firebase);
  
    useEffect(() => {
        adjustTextareaHeight();
    }, []);

    const handleNewQuack = async (newQuack) => {
        try {
            setSent(false);
            const newQuackToPost = {
                userId: newQuack.userId,
                content: newQuack.content,
                likes: newQuack.likes,
                date: newQuack.date,
                updatedAt: newQuack.updatedAt
            }
            await addDoc(collection(db, "quacks"), newQuackToPost);
            setSent(true);
        } catch (e) {
            console.error("Error adding document: ", e);
        }      
    }
    
    const handleQuack = (e) => {
        e.preventDefault();
        const quack: QuackI = (existingQuack) ?
        {
            userId: existingQuack.userId,
            content: quackInputs.content,
            likes: existingQuack.likes,
            date: existingQuack.date,
            updatedAt: new Date().toISOString(),
            id: existingQuack.id
        }
        :
        {
            userId: userInfo.id,
            content: quackInputs.content,
            likes: [],
            date: new Date().toISOString(),
            updatedAt: '',
            id: `tempId_${uuidv4()}`
        };
        if (existingQuack && onUpdate) onUpdate(quack);
        else handleNewQuack(quack);
        setQuackInputs({ content: '' });
        const contentLegend: HTMLElement | null = document.querySelector('.legend-content');
        if (!contentLegend) return;
        contentLegend.style.display = 'none';
    }

    const handleQuackContent = (e) => {
        setQuackInputs({ ...quackInputs, content: e.target.value });
        hideShowLegend(e.target);
        adjustTextareaHeight();
    }

    const adjustTextareaHeight = () => {
        const textarea: HTMLElement | null = document.querySelector('.textarea-content');
        if (!textarea) return;
        textarea.style.height = "auto";
        textarea.style.height = (textarea.scrollHeight + 10) + "px";
    }

    const hideShowLegend = (input) => input.previousElementSibling.style.display = (input.value) ? "unset" : "none";

    return (
        <form onSubmit={(e) => {handleQuack(e)}}  className='quack-form'>
            <fieldset className='quack-form__item quack-form__item--content'>
                <legend className='legend-content'>Your Quack</legend>
                <textarea placeholder='Quack your thoughts here...' value={quackInputs.content} onChange={handleQuackContent} maxLength={240} className='textarea-content' required>
                </textarea>
            </fieldset>
            {quackInputs.content.length > 140 && <span className='quack-form__item--alert'>The quack can't contain more than 140 chars</span>}
            <div className='quack-form__item quack-form__item--submit'>
                <input type='submit'
                    value='Done'
                    className='input-submit'
                    disabled={(quackInputs.content.length > 140) || loading || !sent} />
            </div>
        </form>
    );
}

export default QuackForm;