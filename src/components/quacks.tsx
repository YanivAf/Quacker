import { useState, useEffect, useContext } from 'react';

import QuackerContext from './quackerContext';
import Quack from './quack';
import QuackI from '../interfaces/quackI';
import QuacksUserI from '../interfaces/quacksUserI';

interface Props {
  confirmDelete: (index: number) => void;
  openModal: (eTarget: EventTarget, index: number) => void;
}

const Quacks:React.FC<Props> = ( { confirmDelete, openModal }: Props): JSX.Element => {
  const context = useContext(QuackerContext);
  const { quacks, myQuacks, quacksUsers, searchString, byWhat, whichQuacks, showLikesOnly, userInfo } = context;
  const [quacksToRender, setQuacksToRender] = useState<QuackI[]>((whichQuacks === 'All') ? quacks : myQuacks);
  const [quacksToRenderUsers, setQuacksToRenderUsers] = useState<QuacksUserI[]>(quacksUsers);

  const LikedOrAll = () => {
    const quacksToFilter = (searchString) ? searchQuacks() : quacksToRender;
    if (!showLikesOnly) return;
    setQuacksToRender(quacksToFilter.filter(quackItem => quackItem.likes.find(likeId => likeId === userInfo.id)));
  }

  const searchQuacks = () => {
    const quacksToSearch = (whichQuacks === 'All') ? quacks : myQuacks;
    // const searchRegEx = new RegExp(searchString, 'gmi'); REGEX BUG! https://stackoverflow.com/questions/3891641/regex-test-only-works-every-other-time
    if (byWhat === 'byQuack') setQuacksToRender(quacksToSearch.filter(searchedQuack => (new RegExp(searchString, 'gmi')).test(searchedQuack.content)));
    else setQuacksToRenderUsers(quacksUsers.filter(quacksUser => (new RegExp(searchString, 'gmi')).test(quacksUser.username)));
    return quacksToRender;
  }

  useEffect(() => {
    setQuacksToRender((whichQuacks === 'All') ? quacks : myQuacks);
    setQuacksToRenderUsers(quacksUsers);
    LikedOrAll();
  }, [searchString, whichQuacks, showLikesOnly, byWhat, quacks, myQuacks, quacksUsers]);

  return (
    <section>
      <div className="quacks">
        {quacksToRender.length ?
        quacksToRender.map((quackToRender, index) => {
          const quacksUser = (whichQuacks === 'All') ?
          quacksToRenderUsers.find(quacksToRenderUser => quackToRender.userId === quacksToRenderUser.id)
          :
          {
            username: userInfo.username,
            picUrl: userInfo.picUrl,
            id: userInfo.id
          };
          if (quacksUser) return (
            <Quack
              key={quackToRender.id}
              index={index}
              onDelete={confirmDelete}
              onOpenModal={openModal}
              quacksUser={quacksUser}
              date={new Date(quackToRender.date)}
              updatedAt={quackToRender.updatedAt ? new Date(quackToRender.updatedAt) : null}
              content={quackToRender.content}
              likes={quackToRender.likes}
              id={quackToRender.id} />
          )
          return <></>;
        })
        :
        <h2 className="text-bg">🦆 No quacks to show... 🦆</h2>}
      </div>
    </section>
  )
}

export default Quacks;