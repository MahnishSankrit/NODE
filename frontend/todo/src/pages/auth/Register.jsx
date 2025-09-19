import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

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
            const respose = await axios.post("http://localhost:8000/api/v1/users/register", {
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

        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen text-white">
            <h1 className="text-center text-white text-3xl py-6">Welcome to Registration</h1>

            <div className="flex flex-col justify-center items-center w-full h-full">
                <div className="flex flex-col justify-center items-center bg--800 text-white p-10 rounded-lg shadow-lg w-full max-w-md border-2 ">

                    <form
                     className="space-y-6 w-full"
                     onSubmit={handleRegister}
                     >
                        {/* Full Name */}
                        <div className="flex flex-col">
                            <label htmlFor="fullName" className="mb-1 font-semibold">Full Name</label>
                            <input
                                id="fullName"
                                type="text"
                                name='fullname'
                                placeholder="Enter your full name"
                                className="border-2 border-gray-300 rounded-2xl px-4 py-2 text-black font-bold"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value) }
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col">
                            <label htmlFor="email" className="mb-1 font-semibold">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                className="border-2 border-gray-300 rounded-2xl px-4 py-2 text-black font-bold"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col">
                            <label htmlFor="password" className="mb-1 font-semibold">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Set your password"
                                className="border-2 border-gray-300 rounded-2xl px-4 py-2 text-black font-bold"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Username */}
                        <div className="flex flex-col">
                            <label htmlFor="username" className="mb-1 font-semibold">Username</label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Enter a username"
                                className="border-2 border-gray-300 rounded-2xl px-4 py-2 text-black font-bold"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        {/* Role */}
                        <div className="flex flex-col">
                            <label htmlFor="role" className="mb-1 font-semibold">Role</label>
                            <input
                                id="role"
                                type="text"
                                placeholder="Enter your role (User/Admin)"
                                className="border-2 border-gray-300 rounded-2xl px-4 py-2 text-black font-bold"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-200"
                        >
                            Register
                        </button>
                    </form>
                    <Link to="/" className="mt-4 text-blue-200 hover:underline">
                        Back to Home
                    </Link>


                </div>
            </div>
        </div>

    )
}

export default Register
