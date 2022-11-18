import React, { useEffect, useState } from 'react';
import './App.css';
import { db, getList } from './utils/firebase';
import { Todo } from './components/Todo';
import { todoType } from './components/Todo';
function App() {

  const [data, setData] = useState<Array<todoType>>([]);
  useEffect(() => {

    const fetchData = async() => {
      const res = await getList(db);
      setData(Object(res));
    }
    fetchData();
  }, []);

  const todos = data.map(todo => <Todo {...todo} />
  )
  return (
    <div className="App">
      <header className="App-header">
        Header
      </header>
      <main>
        <ul>{todos}</ul>
      </main>
    </div>
  );
}

export default App;
