
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


    return(
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #667eea, #764ba2)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "40px",
        fontFamily: "Inter, sans-serif"
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          maxWidth: "600px",
          width: "100%"
        }}
      >
        <h2 style={{ textAlign: "center" }}>My Todo List</h2>

        {/* Add Todo Form */}
        <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "5px" }}>
          <h3>Add New Task</h3>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <textarea
              placeholder="Enter task description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: "100%", padding: "8px", minHeight: "60px", resize: "vertical" }}
            />
          </div>
          <button
            onClick={addTodo}
            style={{
              background: "#007bff",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer"
            }}
          >
            Add Task
          </button>
        </div>

        {/* Todo List */}
        <div>
          {todos.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>No tasks yet. Add one above!</p>
          ) : (
            todos.map(todo => (
              <div
                key={todo._id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  padding: "15px",
                  marginBottom: "10px",
                  backgroundColor: todo.status === 'completed' ? '#f0f8f0' : '#fff'
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <h4
                      style={{
                        margin: "0 0 5px 0",
                        textDecoration: todo.status === 'completed' ? 'line-through' : 'none'
                      }}
                    >
                      {todo.title}
                    </h4>
                    <p style={{ margin: "0 0 10px 0", color: "#666" }}>{todo.description}</p>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "3px",
                        fontSize: "12px",
                        backgroundColor:
                          todo.status === 'completed'
                            ? '#28a745'
                            : todo.status === 'inprogress'
                              ? '#ffc107'
                              : '#6c757d',
                        color: 'white'
                      }}
                    >
                      {todo.status}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "5px", flexDirection: "column" }}>
                    {todo.status !== 'completed' && (
                      <>
                        {todo.status === 'pending' && (
                          <button
                            onClick={() => updateTodo(todo._id, 'inprogress')}
                            style={{
                              background: "#ffc107",
                              color: "white",
                              padding: "5px 10px",
                              border: "none",
                              borderRadius: "3px",
                              cursor: "pointer",
                              fontSize: "12px"
                            }}
                          >
                            Start
                          </button>
                        )}
                        <button
                          onClick={() => updateTodo(todo._id, 'completed')}
                          style={{
                            background: "#28a745",
                            color: "white",
                            padding: "5px 10px",
                            border: "none",
                            borderRadius: "3px",
                            cursor: "pointer",
                            fontSize: "12px"
                          }}
                        >
                          Complete
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteTodo(todo._id)}
                      style={{
                        background: "#dc3545",
                        color: "white",
                        padding: "5px 10px",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
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
