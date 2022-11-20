import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { db, getList } from '../../utils/firebase';
import { ITodo, TodoThumb } from '../TodoThumb/TodoThumb';
import { Modal } from '../Modal/Modal';
import { TodoForm } from '../TodoForm/TodoForm';

type IState = {
  state: Array<ITodo>,
  setState: Dispatch<SetStateAction<ITodo[]>>;
}

export const Context = React.createContext<IState>({
  state: [],
  setState: () => {},
});

const INITIAL_TODO = {
  id: '',
  title: '',
  deadline: String(new Date()),
  description: '',
  done: false,
};

export const App = () => {
  const [data, setData] = useState<Array<ITodo>>([]);
  const [isModal, setIsModal] = useState(false);
 
  /** 
   * Fetch data from db on component mount
   * Sort Todos by deadline
   * set data to state
   */
  useEffect(() => {
    const fetchData = async() => {
      const res = await getList(db);
      setData(Object(res).sort((a: ITodo,b: ITodo) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()));
    }
    fetchData();
  }, []);

  /** 
   * Resort data by deadline on data change
   */
  useEffect(() => {
    setData(data.sort((a: ITodo,b: ITodo) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()));
  }, [data])
  
  /** 
   * Close modal component
   */
  const close = () => {
    setIsModal(false);
  }

  /** 
   * SPlit data for categories: completed and active
   */
  const todos = data.sort((a: ITodo,b: ITodo) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  const completed = todos.filter(todo => todo.done).map(todo => <TodoThumb key={todo.id} {...todo} />)

  const active = todos.filter(todo => !todo.done).map(todo => <TodoThumb key={todo.id} {...todo} />)

  return (
    <Context.Provider value={{state: [...data], setState: setData}}>
      <div className="app">
        <header className="app__header">
          <div className='container'>
            <p className="logo">TDL</p>
          </div>
        </header>
        <main className="main">
          <div className='container'>
            <header className="main__header">
              <h1 className='main__heading'>ToDo list</h1>
              <button className="btn" onClick={() => {setIsModal(true)}}>+</button>
              {isModal && (
                <Modal
                  close={close}
                  title={`New task`}>
                <TodoForm
                  close={close}
                  item={{...INITIAL_TODO, id: String(data.length)}}
                  create={true}></TodoForm>
              </Modal>)}
            </header>
            <section className="main__section">
              <h2 className="main__subheader">Active: </h2>
              <ul className="main__list">{active}</ul>
            </section>
            <section className="main__section">
              <h2 className="main__subheader">Completed: </h2>
              <ul className="main__list">{completed}</ul>
            </section>
          </div>
        </main>
      </div>
    </Context.Provider>
  );
}
