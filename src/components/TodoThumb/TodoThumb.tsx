import { useContext, useEffect, useState } from 'react';
import { Modal } from '../Modal/Modal';
import { TodoForm } from '../TodoForm/TodoForm';
import { DocumentData, setDoc, doc, deleteDoc } from 'firebase/firestore/lite';
import { db } from '../../utils/firebase';
import { Context } from '../App/App';

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
  const {state, setState} = useContext(Context);
	const {id, title, done, deadline} = props;
  const [isModal, setIsModal] = useState(false);
  const [isDone, setIsDone] = useState(done);
  const [isLate, setIsLate] = useState(new Date() > new Date(deadline));

  useEffect(()=> {
    setIsDone(done);
  }, [done]);

  const toggleDone = async () => {
    setIsDone(!isDone);
    const newTodo = {
      ...props,
      done: !isDone,
      id, 
    }
    await setDoc(doc(db, "list", id), {...newTodo});

    const preserve = [...state];
    const i = preserve.findIndex(todo => todo.id === id);
    preserve[i] = newTodo;
		setState([...preserve]);
  }

  useEffect(() => {
    const today =  new Date().toJSON().slice(0,10).replace(/-/g,'-');
    if (new Date(today) > new Date(deadline)){
      setIsLate(true);
    } else {
      setIsLate(false);
    }
  }, [deadline]);

  const close = () => {
    setIsModal(false);
  };

  const deleteTodo = async () => {
		const filtered = state.filter(todo => todo.id !== id);
		setState([...filtered]);
		await deleteDoc(doc(db, "list", id));
	};

	return (
		<li className={`todo ${isDone ? 'todo_done' : ''} ${isLate && !isDone ? 'todo_late' : ''} `}>
      <input 
        type="checkbox"
        className='todo__checkbox'
        checked={isDone}
        onChange={toggleDone}
        />
      <p className='todo__title' onClick={() => setIsModal(true)}>
        {title}
      </p>
      <p>{new Date(deadline).toLocaleString().slice(0, 5)}</p>
      <button className="delete-btn" onClick={deleteTodo}>🗙</button>
      {isModal && (<Modal title={`Task: ${title}`} close={close}>
        <TodoForm item={{...props}} create={false} close={close}></TodoForm>
      </Modal>)}
    </li>
	)
}