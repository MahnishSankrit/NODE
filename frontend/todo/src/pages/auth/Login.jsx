import React, { useState } from 'react'
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import API_URL from "../../config/api";

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/api/v1/users/login`, {
                email,
                password,
            })
            console.log("response data", response.data);

            localStorage.setItem("token", response.data.data.acessToken);
            localStorage.setItem("user", JSON.stringify(response.data.data.user)); // storing the user info
            alert("login successfully")

            navigate("/Dashboard")

        } catch (error) {
            alert(error.response?.data?.message || "Login failed");
        }
    }

    return (
      <div className="app-shell flex min-h-screen items-center justify-center px-4 py-10">
        <div className="grid w-full max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          {/* UI refresh: SaaS-style brand panel with the same auth behavior */}
          <div className="hidden lg:block">
            <div className="max-w-xl">
              <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
                Productivity Workspace
              </span>
              <h1 className="mt-6 text-5xl font-semibold tracking-tight text-slate-950">
                Plan work clearly, ship updates faster.
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">
                A cleaner place for your tasks and posts, with the same workflows you already use.
              </p>
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="surface-card p-5">
                  <p className="text-sm font-medium text-slate-500">Focus</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">Track todos with a calmer, clearer interface.</p>
                </div>
                <div className="surface-card p-5">
                  <p className="text-sm font-medium text-slate-500">Collaborate</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">Browse posts and discussions in a more readable layout.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel mx-auto w-full max-w-md rounded-[32px] p-8 sm:p-10">
            <div className="mb-8">
              <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Welcome back
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">Sign in to your account</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Use your existing credentials to continue exactly where you left off.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="flex flex-col">
                <label htmlFor="email" className="mb-2 text-sm font-medium text-slate-700">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="input-modern"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="password" className="mb-2 text-sm font-medium text-slate-700">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="input-modern"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full"
              >
                Login
              </button>

              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-center">
                <p className="text-sm text-slate-600">Don't have an account?</p>
                <Link to="/register" className="btn-secondary mt-3 w-full">
                  Register
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
}

export default Login
