import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../../config/api';

function Register() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fullname, setFullname] = useState("")
    const [role, setRole] = useState("user")

    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()

        try {
            const respose = await axios.post(`${API_URL}/api/v1/users/register`, {
                username,
                email,
                password,
                fullname,
                role
            })
            console.log(respose.data)
            if (respose.status === 201) {
                console.log("Registration successfully! please Login");
                navigate("/")
            }
        } catch (error) {
            console.error(error.response?.data?.message || "Register failed");
            alert(error.response?.data?.message || "Registration failed");
        }
    }

    return (
      <div className="app-shell px-4 py-10">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:pt-10">
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Create account
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Start with the same product, wrapped in a cleaner experience.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
              Registration still works exactly the same. The interface is simply more polished, easier to read, and better on smaller screens.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="surface-card p-5">
                <p className="text-sm font-medium text-slate-500">Clear hierarchy</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">Labels, spacing, and input states are easier to scan.</p>
              </div>
              <div className="surface-card p-5">
                <p className="text-sm font-medium text-slate-500">Responsive layout</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">Comfortable composition across desktop and mobile.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="glass-panel w-full max-w-xl rounded-[32px] p-8 sm:p-10">
              <div className="mb-8">
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Welcome to Registration</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">Fill in the same details as before to create your account.</p>
              </div>
              <form className="space-y-5 w-full" onSubmit={handleRegister}>
                {/* Full Name */}
                <div className="flex flex-col">
                  <label htmlFor="fullName" className="mb-2 text-sm font-medium text-slate-700">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    name='fullname'
                    placeholder="Enter your full name"
                    className="input-modern"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    required
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label htmlFor="email" className="mb-2 text-sm font-medium text-slate-700">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="input-modern"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col">
                  <label htmlFor="password" className="mb-2 text-sm font-medium text-slate-700">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Set your password"
                    className="input-modern"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Username */}
                <div className="flex flex-col">
                  <label htmlFor="username" className="mb-2 text-sm font-medium text-slate-700">Username</label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter a username"
                    className="input-modern"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                {/* Role */}
                <div className="flex flex-col">
                  <label htmlFor="role" className="mb-2 text-sm font-medium text-slate-700">Role</label>
                  <input
                    id="role"
                    type="text"
                    placeholder="Enter your role (User/Admin)"
                    className="input-modern"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn-primary w-full"
                >
                  Register
                </button>
              </form>
              <Link to="/" className="btn-secondary mt-4 w-full">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Register
