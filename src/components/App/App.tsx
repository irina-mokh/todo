import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { db, getList } from '../../utils/firebase';
import { ITodo, TodoThumb } from '../TodoThumb/TodoThumb';

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
  useEffect(() => {

    const fetchData = async() => {
      const res = await getList(db);
      setData(Object(res));
    }
    fetchData();
  }, []);

  const todos = data.map(todo => <TodoThumb {...todo} />
  )
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
            <h1 className='main__heading'>ToDo list</h1>
            <ul className="main__list">{todos}</ul>
          </div>
        </main>
      </div>
    </State.Provider>
  );
}
