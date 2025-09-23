
import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Todo() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/tasks");
      setTodos(res.data.data); // API returns data wrapped in ApiResponse
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  const addTodo = async () => {
    if (title.trim() === "" || description.trim() === "") {
      alert("Both title and description are required!");
      return;
    }
    try {
      const res = await axios.post("http://localhost:8000/api/v1/tasks", {
        title: title,
        description: description
      });
      setTodos([...todos, res.data.data]); // API returns data wrapped in ApiResponse
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };


  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/tasks/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  const updateTodo = async (id, status) => {
    try {
      const res = await axios.put(`http://localhost:8000/api/v1/tasks/${id}`, {
        status: status
      });
      setTodos(todos.map(todo =>
        todo._id === id ? res.data.data : todo
      ));
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };


  return (

    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 flex justify-center pt-10 font-sans">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl w-full">
        <h2 className="text-center text-2xl font-semibold mb-6">My Todo List</h2>

        {/* Add Todo Form */}
        <div className="mb-6 p-4 border border-gray-300 rounded-md">
          <h3 className="text-lg font-medium mb-3">Add New Task</h3>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 mb-3 border border-gray-300 rounded"
            />
            <textarea
              placeholder="Enter task description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 min-h-[60px] resize-y border border-gray-300 rounded"
            />
          </div>
          <button
            onClick={addTodo}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Add Task
          </button>
        </div>

        {/* Todo List */}
        <div>
          {todos.length === 0 ? (
            <p className="text-center text-gray-600">No tasks yet. Add one above!</p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo._id}
                className={`border border-gray-300 rounded-md p-4 mb-4 ${todo.status === 'completed' ? 'bg-green-50' : 'bg-white'
                  }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h4
                      className={`text-lg font-semibold mb-1 ${todo.status === 'completed' ? 'line-through text-gray-500' : ''
                        }`}
                    >
                      {todo.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">{todo.description}</p>
                    <span
                      className={`inline-block text-xs px-2 py-1 rounded text-white ${todo.status === 'completed'
                          ? 'bg-green-600'
                          : todo.status === 'inprogress'
                            ? 'bg-yellow-500'
                            : 'bg-gray-600'
                        }`}
                    >
                      {todo.status}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {todo.status !== 'completed' && (
                      <>
                        {todo.status === 'pending' && (
                          <button
                            onClick={() => updateTodo(todo._id, 'inprogress')}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded"
                          >
                            Start
                          </button>
                        )}
                        <button
                          onClick={() => updateTodo(todo._id, 'completed')}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded"
                        >
                          Complete
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteTodo(todo._id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Todo
