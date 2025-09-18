import React, { useState } from 'react'
import axios from "axios"
import {Link, useNavigate} from "react-router-dom"

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
            console.log("response data",response.data);
            
            localStorage.setItem("token", response.data.data.acessToken);
            alert("login successfully")

            navigate("/Dashboard")

        } catch (error) {
            alert(error.response?.data?.message||"Login failed");
        }
    }

    return (

        <div className='bg-gray-700 flex justify-center items-center w-full h-screen'>
            <div className='flex flex-col justify-center items-center'>
                <h1 className='bg-amber-300 font-bold border-2 rounded-2xl p-2  '>Login here</h1>
                <div className='bg-amber-200 p-10 rounded-2xl border-4 shadow-amber-700'>
                    <form action="" method="post" className="space-y-4"
                    onSubmit={handleLogin}
                    >
                        <label htmlFor="email" className='font-bold'>
                            Email
                            <input
                                id="email"
                                name="email"
                                className="border-2 rounded-2xl p-2 flex flex-col justify-center items-center w-full gap-2"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>

                        <label htmlFor="password" className='font-bold'>
                            Password
                            <input
                                id="password"
                                name="password"
                                className="border-2 rounded-2xl p-2 flex flex-col justify-center items-center w-full gap-2"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                         <button
                            className='bg-amber-800 border-2 rounded-2xl p-2 hover:bg-amber-950'
                            type="submit"
                        >
                            Login
                        </button>
                    </form>

                    <div className=' flex flex-row justify-center items-center space-x-1 space-y-1'>

                       
                        <Link to="/register"> 
                        <button
                            className='bg-amber-800 border-2 rounded-2xl p-2 hover:bg-amber-950'
                        >
                            register
                        </button>
                        </Link>
                    </div>
                    <h3>if you don't have account the register here</h3>
                </div>
            </div>
        </div>

    )
}

export default Login
