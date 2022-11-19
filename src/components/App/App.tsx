import { useEffect, useState } from 'react';
import { db, getList } from '../../utils/firebase';
import { ITodo, TodoThumb } from '../TodoThumb/TodoThumb';

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
  );
}
