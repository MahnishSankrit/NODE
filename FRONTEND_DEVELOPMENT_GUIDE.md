# Frontend Development Guide for React + Tailwind CSS

## Overview
This document provides a comprehensive guide to build a modern, responsive frontend application using **React** and **Tailwind CSS** for the backend API system. The backend provides four main services: User Authentication, Task Management, Post Management, and Comment System.

## Table of Contents
1. [Project Structure](#project-structure)
2. [Setup and Installation](#setup-and-installation)
3. [API Integration](#api-integration)
4. [UI Components](#ui-components)
5. [Page Layouts](#page-layouts)
6. [State Management](#state-management)
7. [Styling Guide](#styling-guide)
8. [Features Implementation](#features-implementation)

---

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── AuthLayout.jsx
│   │   ├── tasks/
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskList.jsx
│   │   │   └── TaskFilters.jsx
│   │   ├── posts/
│   │   │   ├── PostCard.jsx
│   │   │   ├── PostForm.jsx
│   │   │   ├── PostList.jsx
│   │   │   └── PostFilters.jsx
│   │   └── comments/
│   │       ├── CommentCard.jsx
│   │       ├── CommentForm.jsx
│   │       └── CommentList.jsx
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Tasks.jsx
│   │   ├── Posts.jsx
│   │   ├── Profile.jsx
│   │   └── PostDetail.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTasks.js
│   │   ├── usePosts.js
│   │   └── useComments.js
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── taskService.js
│   │   ├── postService.js
│   │   └── commentService.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── App.jsx
│   └── main.jsx
├── tailwind.config.js
├── package.json
└── vite.config.js
```

---

## Setup and Installation

### 1. Create React Application
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

### 2. Install Dependencies
```bash
# Core dependencies
npm install react-router-dom axios react-query @tanstack/react-query
npm install react-hook-form @hookform/resolvers yup
npm install lucide-react react-hot-toast

# Development dependencies
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Configure Tailwind CSS

**tailwind.config.js:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
```

**src/index.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

@layer base {
  html {
    font-family: 'Inter', system-ui, sans-serif;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
  }
  
  .btn-secondary {
    @apply bg-secondary-100 hover:bg-secondary-200 text-secondary-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200;
  }
  
  .input-field {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200;
  }
  
  .card {
    @apply bg-white rounded-xl shadow-sm border border-gray-100 p-6;
  }
}
```

---

## API Integration

### Base API Configuration

**src/services/api.js:**
```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Authentication Service

**src/services/authService.js:**
```javascript
import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    const { data } = response.data;
    
    if (data.acessToken) {
      localStorage.setItem('accessToken', data.acessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  logout: async () => {
    try {
      await api.post('/users/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
```

### Task Service

**src/services/taskService.js:**
```javascript
import api from './api';

export const taskService = {
  getAllTasks: async () => {
    const response = await api.get('/tasks/tasks');
    return response.data;
  },

  getTaskById: async (id) => {
    const response = await api.get(`/tasks/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/tasks/tasks', taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/tasks/${id}`);
    return response.data;
  }
};
```

### Post Service

**src/services/postService.js:**
```javascript
import api from './api';

export const postService = {
  getAllPosts: async (params = {}) => {
    const response = await api.get('/posts/getallpost', { params });
    return response.data;
  },

  getPostById: async (postId) => {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },

  createPost: async (postData) => {
    const response = await api.post('/posts/createPost', postData);
    return response.data;
  },

  updatePost: async (postId, postData) => {
    const response = await api.put(`/posts/${postId}`, postData);
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },

  likePost: async (postId) => {
    const response = await api.put(`/posts/like/${postId}`);
    return response.data;
  }
};
```

---

## UI Components

### Authentication Components

**src/components/auth/LoginForm.jsx:**
```jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginForm = ({ onSubmit, loading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-gray-600 mt-2">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="input-field pl-10"
              placeholder="Enter your email"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', { required: 'Password is required' })}
              className="input-field pl-10 pr-10"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 text-lg"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
```

### Task Components

**src/components/tasks/TaskCard.jsx:**
```jsx
import { useState } from 'react';
import { Edit3, Trash2, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      inprogress: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status] || colors.pending;
  };

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      await onStatusChange(task._id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800 flex-1 mr-4">
          {task.title}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-4 leading-relaxed">
        {task.description}
      </p>

      {/* Status and Date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(task.status)}`}>
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
          <span className="text-sm text-gray-500 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {format(new Date(task.createdAt), 'MMM dd, yyyy')}
          </span>
        </div>

        {/* Status Dropdown */}
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={isUpdating}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
};

export default TaskCard;
```

### Post Components

**src/components/posts/PostCard.jsx:**
```jsx
import { useState } from 'react';
import { Heart, MessageCircle, Share2, Edit3, Trash2, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

const PostCard = ({ post, onLike, onEdit, onDelete, onClick, currentUserId }) => {
  const [isLiking, setIsLiking] = useState(false);
  const isLiked = post.likes?.includes(currentUserId);
  const isAuthor = post.author?._id === currentUserId;

  const handleLike = async (e) => {
    e.stopPropagation();
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      await onLike(post._id);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div 
      className="card hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => onClick(post._id)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-800">
              {post.author?.username || 'Anonymous'}
            </h4>
            <p className="text-sm text-gray-500 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {format(new Date(post.createdAt), 'MMM dd, yyyy')}
            </p>
          </div>
        </div>

        {isAuthor && (
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(post);
              }}
              className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(post._id);
              }}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-gray-800 mb-3">
        {post.title}
      </h3>
      <p className="text-gray-600 mb-4 leading-relaxed">
        {post.content.length > 150 
          ? `${post.content.substring(0, 150)}...` 
          : post.content
        }
      </p>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              isLiked
                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{post.likes?.length || 0}</span>
          </button>

          <div className="flex items-center space-x-2 px-3 py-2 text-gray-600">
            <MessageCircle className="w-5 h-5" />
            <span>{post.commentCount || 0}</span>
          </div>

          <div className="flex items-center space-x-2 px-3 py-2 text-gray-600">
            <Share2 className="w-5 h-5" />
            <span>{post.shares || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
```

---

## Page Layouts

### Dashboard Page

**src/pages/Dashboard.jsx:**
```jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, FileText, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { taskService } from '../services/taskService';
import { postService } from '../services/postService';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    totalPosts: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [tasksResponse, postsResponse] = await Promise.all([
          taskService.getAllTasks(),
          postService.getAllPosts({ limit: 5 })
        ]);

        const tasks = tasksResponse.data || [];
        const completedTasks = tasks.filter(task => task.status === 'completed');

        setStats({
          totalTasks: tasks.length,
          completedTasks: completedTasks.length,
          totalPosts: postsResponse.data?.totalPosts || 0,
          recentActivity: postsResponse.data?.posts || []
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      icon: CheckSquare,
      color: 'bg-blue-500',
      link: '/tasks'
    },
    {
      title: 'Completed Tasks',
      value: stats.completedTasks,
      icon: TrendingUp,
      color: 'bg-green-500',
      link: '/tasks'
    },
    {
      title: 'Total Posts',
      value: stats.totalPosts,
      icon: FileText,
      color: 'bg-purple-500',
      link: '/posts'
    },
    {
      title: 'Task Completion',
      value: stats.totalTasks ? `${Math.round((stats.completedTasks / stats.totalTasks) * 100)}%` : '0%',
      icon: Users,
      color: 'bg-orange-500',
      link: '/tasks'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.fullname || user?.username}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your tasks and posts today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link
              key={index}
              to={stat.link}
              className="card hover:shadow-lg transition-shadow duration-200 group"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-xl ${stat.color} text-white group-hover:scale-105 transition-transform duration-200`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/tasks/new"
              className="block p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors duration-200"
            >
              <h3 className="font-medium text-primary-900">Create New Task</h3>
              <p className="text-sm text-primary-700">Add a new task to your list</p>
            </Link>
            <Link
              to="/posts/new"
              className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200"
            >
              <h3 className="font-medium text-green-900">Write New Post</h3>
              <p className="text-sm text-green-700">Share your thoughts with others</p>
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Posts</h2>
          <div className="space-y-3">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((post) => (
                <Link
                  key={post._id}
                  to={`/posts/${post._id}`}
                  className="block p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <h3 className="font-medium text-gray-900 truncate">{post.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {post.content.substring(0, 100)}...
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <span>{post.likes?.length || 0} likes</span>
                    <span className="mx-2">•</span>
                    <span>{post.commentCount || 0} comments</span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent posts</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
```

---

## State Management

### Auth Context

**src/context/AuthContext.jsx:**
```jsx
import { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
    error: null
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const user = authService.getCurrentUser();
        
        if (token && user) {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user, token }
          });
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authService.login(credentials);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.user,
          token: response.acessToken
        }
      });
      
      toast.success('Login successful!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authService.register(userData);
      toast.success('Registration successful! Please login.');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      dispatch({ type: 'LOGOUT' });
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

---

## Custom Hooks

### useTasks Hook

**src/hooks/useTasks.js:**
```javascript
import { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getAllTasks();
      setTasks(response.data || []);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch tasks');
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      const response = await taskService.createTask(taskData);
      setTasks(prev => [response.data, ...prev]);
      toast.success('Task created successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      toast.error(message);
      throw error;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const response = await taskService.updateTask(id, taskData);
      setTasks(prev => prev.map(task => 
        task._id === id ? response.data : task
      ));
      toast.success('Task updated successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task';
      toast.error(message);
      throw error;
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task._id !== id));
      toast.success('Task deleted successfully');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task';
      toast.error(message);
      throw error;
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      const response = await taskService.updateTask(id, { status });
      setTasks(prev => prev.map(task => 
        task._id === id ? { ...task, status } : task
      ));
      toast.success('Task status updated');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update status';
      toast.error(message);
      throw error;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    refetch: fetchTasks
  };
};
```

---

## Styling Guide

### Component Styling Patterns

#### 1. **Layout Classes**
```css
/* Container patterns */
.container-sm { @apply max-w-2xl mx-auto px-4; }
.container-md { @apply max-w-4xl mx-auto px-4; }
.container-lg { @apply max-w-6xl mx-auto px-4; }

/* Grid patterns */
.grid-responsive { @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6; }
.grid-auto { @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4; }
```

#### 2. **Interactive Elements**
```css
/* Button variants */
.btn-primary { @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2; }
.btn-secondary { @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200; }
.btn-danger { @apply bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200; }

/* Icon buttons */
.icon-btn { @apply p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200; }
.icon-btn-primary { @apply p-2 rounded-lg hover:bg-primary-100 text-primary-600 transition-colors duration-200; }
```

#### 3. **Form Styling**
```css
/* Input variations */
.input-field { @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200; }
.input-error { @apply border-red-500 focus:ring-red-500; }
.input-success { @apply border-green-500 focus:ring-green-500; }

/* Form layouts */
.form-group { @apply mb-4; }
.form-row { @apply grid grid-cols-1 md:grid-cols-2 gap-4; }
```

#### 4. **Status Indicators**
```css
/* Badge/Tag styling */
.badge { @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium; }
.badge-primary { @apply bg-primary-100 text-primary-800; }
.badge-success { @apply bg-green-100 text-green-800; }
.badge-warning { @apply bg-yellow-100 text-yellow-800; }
.badge-danger { @apply bg-red-100 text-red-800; }
```

---

## Features Implementation

### 1. **Task Management Features**

#### Task Filtering and Sorting
- Filter by status (pending, in-progress, completed)
- Sort by creation date, title, or status
- Search functionality by title and description

#### Task Status Updates
- Visual status indicators with color coding
- Drag-and-drop status updates (optional)
- Quick status change dropdown

#### Task Analytics
- Progress tracking with visual charts
- Completion rate statistics
- Time-based analytics

### 2. **Post Management Features**

#### Social Features
- Like/unlike posts with real-time updates
- Comment system with nested replies
- Post sharing functionality
- User mentions and hashtags

#### Content Features
- Rich text editor for posts
- Image upload support (if backend supports)
- Draft saving functionality
- Post scheduling (if backend supports)

#### Discovery Features
- Tag-based filtering
- Author-based filtering
- Trending posts
- Search functionality

### 3. **User Experience Features**

#### Navigation
- Responsive sidebar navigation
- Breadcrumb navigation
- Mobile-friendly hamburger menu
- Quick action floating button

#### Notifications
- Toast notifications for all actions
- Real-time updates (using WebSocket if available)
- Success/error state handling
- Loading states and skeletons

#### Accessibility
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- High contrast mode support

---

## Responsive Design Strategy

### Breakpoint System
```css
/* Tailwind breakpoints */
sm: 640px    /* Small devices */
md: 768px    /* Medium devices */
lg: 1024px   /* Large devices */
xl: 1280px   /* Extra large */
2xl: 1536px  /* 2X Extra large */
```

### Mobile-First Approach
1. **Mobile (default)**: Single column layout, touch-friendly buttons
2. **Tablet (md)**: Two-column layouts, larger touch targets
3. **Desktop (lg+)**: Multi-column layouts, hover effects, keyboard shortcuts

### Component Responsiveness
- Cards stack on mobile, grid on desktop
- Navigation collapses to hamburger menu on mobile
- Forms adapt to single column on small screens
- Tables become horizontally scrollable on mobile

---

## Performance Optimization

### 1. **Code Splitting**
```jsx
// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Posts = lazy(() => import('./pages/Posts'));
```

### 2. **Image Optimization**
- Use WebP format with fallbacks
- Implement lazy loading
- Responsive image sizes

### 3. **Bundle Optimization**
- Tree shaking for unused code
- Minimize dependencies
- Use production builds

### 4. **Caching Strategy**
- Implement React Query for API caching
- Service worker for offline functionality
- Local storage for user preferences

---

## Testing Strategy

### 1. **Unit Testing**
```jsx
// Example test for TaskCard component
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from './TaskCard';

test('renders task title and description', () => {
  const mockTask = {
    _id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'pending'
  };

  render(<TaskCard task={mockTask} onEdit={jest.fn()} onDelete={jest.fn()} />);
  
  expect(screen.getByText('Test Task')).toBeInTheDocument();
  expect(screen.getByText('Test Description')).toBeInTheDocument();
});
```

### 2. **Integration Testing**
- Test API integrations
- Test user workflows
- Test form submissions

### 3. **E2E Testing**
- User registration and login
- Task creation and management
- Post creation and interaction

---

## Deployment Considerations

### 1. **Environment Configuration**
```javascript
// src/config/environment.js
const config = {
  development: {
    API_BASE_URL: 'http://localhost:8000/api/v1'
  },
  production: {
    API_BASE_URL: 'https://your-api.com/api/v1'
  }
};

export default config[process.env.NODE_ENV || 'development'];
```

### 2. **Build Configuration**
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react']
        }
      }
    }
  }
});
```

### 3. **PWA Support**
- Service worker implementation
- App manifest configuration
- Offline functionality
- Push notifications (if needed)

---

## Security Best Practices

### 1. **Authentication Security**
- Secure token storage
- Token expiration handling
- Automatic logout on token expiry
- CSRF protection

### 2. **Input Validation**
- Client-side validation with server-side backup
- XSS prevention
- SQL injection prevention
- File upload security

### 3. **API Security**
- HTTPS enforcement
- Rate limiting awareness
- Error handling without sensitive data exposure
- Proper CORS configuration

---

This comprehensive guide provides everything needed to build a modern, responsive, and feature-rich frontend application for your backend system. The combination of React and Tailwind CSS will ensure a fast, maintainable, and visually appealing user interface that works seamlessly with your existing API endpoints.
