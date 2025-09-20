
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/auth/Register'
import Topbar from './components/Topbar';

function App() {
  return (
    <Router>
   
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register/>} />
      </Routes>
    </Router>
  );
}

export default App;
