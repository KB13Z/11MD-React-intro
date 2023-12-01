import { useState, useEffect } from 'react'
import './App.css'

interface Todo {
  id: number;
  todo: string;
  markedAsDone: boolean;
  isEditing: boolean
}

function App() {
  const initialList: Todo[] = JSON.parse(localStorage.getItem('todoList') || '[]');
  const [list, setList] = useState<Todo[]>(initialList);
  const [input, setInput] = useState('');
  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    localStorage.setItem('todoList', JSON.stringify(list));
  }, [list]);

  const addTodo = (todo: string): void => {
    const newTodo = {
      id: Math.random(),
      todo: todo,
      markedAsDone: false,
      isEditing: false,
    }

    setList([...list, newTodo]);
    setInput('');
  }

  const markAsDone = (id: number) => {
    setList((prevList) => prevList.map((todo) =>
      todo.id === id ? {...todo, markedAsDone: !todo.markedAsDone} : todo));
  }

  const editTodo = (id: number) => {
    setList((prevList) =>
      prevList.map((todo) =>
        todo.id === id ? { ...todo, isEditing: true } : todo
      )
    )

    const currentTodo = list.find((todo) => todo.id === id);
    setEditedText(currentTodo ? currentTodo.todo : '');
  }

  const saveEdit = (id: number, editedText: string) => {
    setList((prevList) =>
      prevList.map((todo) =>
        todo.id === id ? { ...todo, todo: editedText, isEditing: false } : todo
      )
    )
    setEditedText('');
  }

  const deleteTodo = (id: number) => {
    const newList = list.filter((todo) => todo.id !== id);

    setList(newList);
  }

  return (
    <div className="appWrapper">
      <h1 className="appHeading">ToDo list</h1>
      <div className="inputWrapper">
        <input 
          type="text"
          className="appInput"
          value={input} 
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="appButton" onClick={() => addTodo(input)}>
          Add
        </button>
      </div>
      <ul className="appList">
      {list.map((todo) => (
          <li key={todo.id} className={`appListItem ${ todo.markedAsDone ? 'markedAsDone' : '' }`}>
            {todo.isEditing ? (
              <>
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
                <button className="saveButton" onClick={() => saveEdit(todo.id, editedText)}>
                  Save
                </button>
              </>
            ) : (
              <>
                {todo.todo}
                <div className="liButtonWrapper">
                  <button className="doneButton" onClick={() => markAsDone(todo.id)}>
                    Done
                  </button>
                  <button className="editButton" onClick={() => editTodo(todo.id)}>
                    Edit
                  </button>
                  <button className="deleteButton" onClick={() => deleteTodo(todo.id)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
