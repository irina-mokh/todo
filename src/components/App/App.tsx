import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { db, getList } from '../../utils/firebase';
import { ITodo, TodoThumb } from '../TodoThumb/TodoThumb';
import { Modal } from '../Modal/Modal';
import { TodoForm } from '../TodoForm/TodoForm';

type IState = {
  state: Array<ITodo>,
  setState: Dispatch<SetStateAction<ITodo[]>>;
}

export const State = React.createContext<IState>({
  state: [],
  setState: () => {},
});


export const App = () => {
  const [data, setData] = useState<Array<ITodo>>([]);
  const [isModal, setIsModal] = useState(false);

  useEffect(() => {
    const fetchData = async() => {
      const res = await getList(db);
      setData(Object(res).sort((a: ITodo, b: ITodo) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()));
    }
    fetchData();
  }, []);

  // sort by date
  useEffect(() => {
    const sorted = data.sort((a,b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    setData(sorted);
  }, [data]);

  const todos = data.map(todo => <TodoThumb {...todo} />
  );

  const close = () => {
    setIsModal(false);
  }
  return (
    <State.Provider value={{state: [...data], setState: setData}}>
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
                  item={{
                    id: '',
                    title: '',
                    deadline: String(new Date()),
                    description: '',
                    done: false,
                  }}
                  create={true}></TodoForm>
              </Modal>)}
            </header>
            <ul className="main__list">{todos}</ul>
          </div>
        </main>
        
      </div>
    </State.Provider>
  );
}
