import { useState, useContext } from 'react';
import Modal from 'react-modal';

import { modalStyle } from '../styles/modalStyle';

import { getFirestore, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { FirebaseContext } from '../utilities/firebase';

import '../Quacker.scss';
import QuackForm from '../components/quackForm';
import Quacks from '../components/quacks';
import Loader from '../components/loader';
import QuackerContext from './quackerContext';

import swal from 'sweetalert';

Modal.setAppElement('#root');

const Home:React.FC = (): JSX.Element => {
  const context = useContext(QuackerContext);
  const firebase = useContext(FirebaseContext);
  const db = getFirestore(firebase);

  const { userInfo, quacks, myQuacks, loading, badRequest, setQuacksLimit, quacksLimit, setMyQuacksLimit, myQuacksLimit, whichQuacks } = context;
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const [modalQuackIndex, setModalQuackIndex] = useState<number>(0);

  const handleUpdate = async (updatedQuack) => {
    const newQuackContent = { content: updatedQuack.content, updatedAt: updatedQuack.updatedAt };
    await updateDoc(doc(db, "quacks", updatedQuack.id), newQuackContent);
closeModal();
  }

  const confirmDelete = (deleteIndex: number) => {
    swal({
      title: "Delete Quack?",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true
    })
    .then(async (willDelete: boolean) => {
      if (willDelete) {
        await deleteDoc(doc(db, 'quacks', quacks[deleteIndex].id));
      } else swal(`Deletion cancelled`);
    });
  }

  const openModal = (targetElement, updateIndex) => {
    if (targetElement.classList.contains('fa-trash') || targetElement.classList.contains('fa-thumbs-up')) return;
    setModalQuackIndex(updateIndex);
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
  }

  return (
    <>
        <header className="Quacker-header">
          <QuackForm existingQuack={null} onUpdate={null} />
          <br />
          {(whichQuacks === 'My') &&
          <img src={userInfo.picUrl}
          className='header-profile-pic'
          alt={`My Quacks`}
          title={`My Quacks`} />}
        </header>
        <main className="Quacker-main">
          {badRequest ?
          <h3>Server Issues! Please refresh...</h3>
          :
          (loading ?
          <Loader />
          :
          <>
          <Quacks {...{ confirmDelete, openModal }} />
          {((((quacks.length % 10) || (quacks.length < quacksLimit)) && (whichQuacks === 'All')) || (((myQuacks.length % 10) || (myQuacks.length < myQuacksLimit)) && (whichQuacks === 'My'))) ?
          <p className="text-bg">🦆 No more quacks to load 🦆</p>
          :
          <button
          className='more-quacks'
          onClick={() => {
            if (whichQuacks === 'All') setQuacksLimit(quacksLimit + 10);
            else setMyQuacksLimit(myQuacksLimit + 10);
            }}>
            Load more
          </button>}
          </>)}
          <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={modalStyle}>
              <span className="modal__item modal__item--close" onClick={closeModal}>✖</span>
              <QuackForm onUpdate={handleUpdate} existingQuack={modalIsOpen ? ((whichQuacks === 'All') ? quacks[modalQuackIndex] : myQuacks[modalQuackIndex]) : null} />
          </Modal>
        </main>
    </>
  );
}

export default Home;