
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Topbar from './Topbar';
import API_URL from '../config/api';

function Todo() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }


  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/mytodos`, axiosConfig);
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
      const res = await axios.post(`${API_URL}/api/v1/mytodos`, {
        title: title,
        description: description
      }, axiosConfig);

      setTodos([...todos, res.data.data]); // API returns data wrapped in ApiResponse
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };


  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/v1/mytodos/${id}`, axiosConfig);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  const updateTodo = async (id, status) => {
    try {
      const res = await axios.put(`${API_URL}/api/v1/mytodos/${id}`, {
        status: status
      }, axiosConfig);
      setTodos(todos.map(todo =>
        todo._id === id ? res.data.data : todo
      ));
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };


  return (
    <div className="app-shell min-h-screen">
      <Topbar />
      <div className="page-container">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Task manager
            </span>
            <h2 className="section-title mt-4">Keep work moving with a cleaner todo board.</h2>
            <p className="section-copy mt-3">All task actions remain identical. This update only improves layout, hierarchy, and visual polish.</p>
          </div>
          <div className="surface-card max-w-md p-5">
            <p className="text-sm font-medium text-slate-500">Status at a glance</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">Pending, in progress, and completed tasks are now easier to distinguish without changing any state logic.</p>
          </div>
        </div>

        <div className="glass-panel rounded-[32px] p-6 md:p-8">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">My Todo List</h2>

          {/* Add Todo Form */}
          <div className="mt-8 mb-8 rounded-[28px] border border-slate-200/80 bg-white/80 p-5 md:p-6">
            <h3 className="mb-4 text-base font-semibold text-slate-900 md:text-lg">Add New Task</h3>
            <div className="mb-4 grid grid-cols-1 gap-3">
              <input
                type="text"
                placeholder="Enter task title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-modern"
              />
              <textarea
                placeholder="Enter task description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea-modern min-h-[96px]"
              />
            </div>
            <button
              onClick={addTodo}
              className="btn-primary"
            >
              Add Task
            </button>
          </div>

          {/* Todo List */}
          <div className="space-y-4">
            {todos.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50/80 px-6 py-14 text-center">
                <p className="text-lg font-semibold text-slate-800">No tasks yet. Add one above!</p>
                <p className="mt-2 text-sm text-slate-500">Your workflow is ready whenever you are.</p>
              </div>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo._id}
                  className={`rounded-[28px] border p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                    todo.status === 'completed'
                      ? 'border-emerald-200 bg-emerald-50/80'
                      : todo.status === 'inprogress'
                        ? 'border-amber-200 bg-amber-50/80'
                        : 'border-slate-200 bg-white/90'
                  }`}
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="min-w-0 flex-1">
                      <h4 className={`mb-2 text-base font-semibold tracking-tight md:text-lg ${todo.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                        {todo.title}
                      </h4>
                      <p className="mb-3 break-words text-sm leading-6 text-slate-600">{todo.description}</p>
                      <span className={`status-pill ${
                        todo.status === 'completed'
                          ? 'bg-emerald-600 text-white'
                          : todo.status === 'inprogress'
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-200 text-slate-700'
                      }`}>
                        {todo.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:flex-col">
                      {todo.status !== 'completed' && (
                        <>
                          {todo.status === 'pending' && (
                            <button
                              onClick={() => updateTodo(todo._id, 'inprogress')}
                              className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-600"
                            >
                              Start
                            </button>
                          )}
                          <button
                            onClick={() => updateTodo(todo._id, 'completed')}
                            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                          >
                            Complete
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deleteTodo(todo._id)}
                        className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
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
    </div>
  );
}

export default Todo
