import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/auth/Register';
import Todo from './components/Todo';
import ProtectedRoute from './components/ProtectedRoutes';
import Post from './pages/Post';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/posts" element={<Post />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
