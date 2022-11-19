import { DocumentData } from 'firebase/firestore/lite';
import { useEffect, useState } from 'react';
import { Modal } from '../Modal/Modal';
import { TodoForm } from '../TodoForm/TodoForm';
import { setDoc, doc } from 'firebase/firestore/lite';
import { db } from '../../utils/firebase';

export interface ITodo extends DocumentData {
  id: string;
  title: string;
  description: string;
  deadline: string;
  file?: string;
  fileName?: string;
  done: boolean;
}

export const TodoThumb = (props: ITodo) => {
	const {id, title, done, deadline} = props;
  const [isModal, setIsModal] = useState(false);

  const [isDone, setIsDone] = useState(done)
  const toggleDone = async () => {
    setIsDone(!isDone);
    const newTodo = {
      ...props,
      done: !isDone,
    }
    await setDoc(doc(db, "list", id), {...newTodo});

  }

  const [isLate, setIsLate] = useState(false)
  useEffect(() => {
    const today =  new Date().toJSON().slice(0,10).replace(/-/g,'-');
    if (new Date(today) > new Date(deadline)){
      setIsLate(true);
    }
  }, [deadline]);

  const close = () => {
    setIsModal(false);
  }

	return (
		<li key={id} className={`todo ${isDone ? 'todo_done' : ''} ${isLate && !isDone ? 'todo_late' : ''} `}>
      <input 
        type="checkbox"
        className='todo__checkbox'
        checked={isDone}
        onChange={toggleDone}
        />
      <p className='todo__title' onClick={() => setIsModal(true)}>
        {title}
      </p>
      {isModal && (<Modal title={`Task: ${title}`} close={close}>
        <TodoForm item={{...props}} create={false} close={close}></TodoForm>
      </Modal>)}
    </li>
	)
}