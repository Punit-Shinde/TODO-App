import React, { useEffect, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import Todo from './Todo'
import { db } from './firebase'
import { query, collection, onSnapshot, updateDoc, doc, addDoc, deleteDoc } from 'firebase/firestore'

function App() {

  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');


  //create todo
  const createTodo = async (e) => {
    e.preventDefault(e)
    if (input === '') {
      alert('Please enter a valid todo')
      return
    }
    await addDoc(collection(db, 'todos'), {
      text: input,
      completed: false,
    })

    setInput('')  //for leaving space empty after giving the todo list item

  };





  //read todo
  useEffect(() => {
    const q = query(collection(db, 'todos'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr = [];
      querySnapshot.forEach((doc) => {
        todosArr.push({ ...doc.data(), id: doc.id })
      });
      setTodos(todosArr)
    })
    return () => unsubscribe()
  }, [])



  //update todo
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, 'todos', todo.id), {
      completed: !todo.completed
    })
  }


  //delete todo
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, 'todos', id))
  }

  return (
    <div className={`h-screen w-screen p-4 bg-gradient-to-r from-[#ee82ee] to-[#000ff]`}>
      <div className={`bg-slate-300 max-w-[700px] w-full m-auto rounded-md shadow-xl p-4 transition: all 0.2s ease-in-out`}>
        <h3 className={`text-3xl font-bold text-center text-black p-2`}>To-do List</h3>
        <form onSubmit={createTodo} className={`flex justify-between`}>
          <input value={input} onChange={(e) => setInput(e.target.value)} className={`border p-2 w-full text-xl`} type="text" placeholder='Add Todo' />
          <button className={`border p-4 ml-2 bg-purple-400`}><AiOutlinePlus size={30} /></button>
        </form>
        <ul>
          {todos.map((todo, index) => (
            <Todo key={index} todo={todo} toggleComplete={toggleComplete} deleteTodo={deleteTodo} />
          ))}

        </ul>

        {todos.length < 1 ? null : <p className={`text-center p-2`}>{`You have ${todos.length} todos`}</p>}



      </div>



    </div>
  )
}

export default App