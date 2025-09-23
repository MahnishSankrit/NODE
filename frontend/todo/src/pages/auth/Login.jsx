import React, { useState } from 'react'
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8000/api/v1/users/login", {
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

        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen flex items-center justify-center text-white">
            <div className=" bg-opacity-10 backdrop-blur-md p-10 rounded-2xl border-4 border-white shadow-xl w-full max-w-md">

                <h1 className="text-3xl font-bold text-center mb-6">Login Here</h1>

                <form action="" method="post"
                    onSubmit={handleLogin}
                    className="space-y-6"
                >
                  
                    <div className="flex flex-col">
                        <label htmlFor="email" className="font-semibold mb-1">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            className="border-2 rounded-2xl p-3 text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                  
                    <div className="flex flex-col">
                        <label htmlFor="password" className="font-semibold mb-1">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            className="border-2 rounded-2xl p-3 text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                  
                    <button
                        type="submit"
                        className="w-full bg-sky-800 hover:bg-sky-950 text-white font-bold py-2 rounded-2xl transition duration-300"
                    >
                        Login
                    </button>

                 
                    <div className="text-center">
                        <p className="text-sm">Don't have an account?</p>
                        <Link to="/register">
                            <button className="mt-2 bg-sky-800 hover:bg-sky-950 text-white font-bold py-2 px-6 rounded-2xl transition duration-300">
                                Register
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default Login
