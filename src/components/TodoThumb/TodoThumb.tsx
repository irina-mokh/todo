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

  const [isModalTask, setIsModalTask] = useState(false)
  const closeTaskModal = () => {
    setIsModalTask(false);
  }
	return (
		<li key={id} className={`todo ${isDone ? 'todo_done' : ''} ${isLate && !isDone ? 'todo_late' : ''} `}>
      <input 
        type="checkbox"
        className='todo__checkbox'
        checked={isDone}
        onChange={toggleDone}
        />
      <p className='todo__title' onClick={()=>{setIsModalTask(true)}}>
        {title}
      </p>
      {isModalTask && (
        <Modal close={closeTaskModal} title={`Task: ${title}`}>
          <TodoForm item={{...props}} create={false} closeModal={closeTaskModal}></TodoForm>
        </Modal>)}
    </li>
	)
}