import { DocumentData } from 'firebase/firestore/lite';
import { useEffect, useState } from 'react';

export interface todoType extends DocumentData {
  id: string;
  title: string;
  description: string;
  deadline: string;
  file?: string;
  done: boolean;
}
export const Todo = (props: todoType) => {
	const {id, title, done, deadline} = props;

  const [isDone, setIsDone] = useState(done)
  const toggleDone = () => {
    setIsDone(!isDone);
    //TODO send to BE
  }

  const [isLate, setIsLate] = useState(false)
  useEffect(() => {
    const today =  new Date().toJSON().slice(0,10).replace(/-/g,'-');
    if (new Date(today) > new Date(deadline)){
      setIsLate(true);
    }
  }, [deadline]);

  const [isModal, setIsModal] = useState(false)
  
	return (
		<li key={id} className={`todo ${isDone ? 'todo_done' : ''} ${isLate && !isDone ? 'todo_late' : ''} `}>
      <input 
        type="checkbox"
        className='todo__checkbox'
        checked={isDone}
        onChange={toggleDone}
        />
      <p className='todo__title' onClick={() => setIsModal(true)}>{title}</p>
      {isModal && (<div>popup</div>)}
    </li>
	)
}