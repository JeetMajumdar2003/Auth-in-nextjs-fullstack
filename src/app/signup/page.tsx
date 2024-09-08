'use client'    // whenever we are using any kind of React Hooks, we should use 'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function SignupPage() {

    const router = useRouter()

    // state variables
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: ""
    })
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [loading, setLoading] = useState(false)

    // signup user
    const onSignup = async () => {
        setLoading(true)
        setButtonDisabled(true)
        try {
            // we can use fetch() to make a POST request to the server(also we can use axios)
            const response = await fetch('http://localhost:3000/api/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
            })
            if (!response.ok) {
            throw new Error('Signup failed')
            }
            const data = await response.json()
            console.log('Signup successful', data)

            // redirect
            router.push('./login')
        } catch (error: any) {
            console.log("Signup Failed! Try again later")
        } finally {
            setLoading(false)
            setButtonDisabled(false)
        }
    }

    // enable/disable button
    useEffect(() => {
        if (user.username.length > 0 && user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }, [user])

    return (
        <div className='flex flex-col items-center justify-center min-h-screen py-2 bg-gray-900 text-white'>
            <div className='w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-md'>
                <h1 className='text-3xl font-bold mb-4 text-center'>{loading ? "Processing..." : "Signup"}</h1>
                <hr className='border-gray-700 w-full mb-4' />
                <label htmlFor="username" className='self-start mb-2'>Username:</label>
                <input
                    className='p-2 border border-gray-700 rounded-lg mb-4 focus:outline-none focus:border-blue-500 bg-gray-800 text-white w-full'
                    id='username'
                    value={user.username}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                    placeholder='Enter your username'
                    type="text"
                />
                <label htmlFor="email" className='self-start mb-2'>Email:</label>
                <input
                    className='p-2 border border-gray-700 rounded-lg mb-4 focus:outline-none focus:border-blue-500 bg-gray-800 text-white w-full'
                    id='email'
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    placeholder='Enter your email'
                    type="email"
                />
                <label htmlFor="password" className='self-start mb-2'>Password:</label>
                <input
                    className='p-2 border border-gray-700 rounded-lg mb-4 focus:outline-none focus:border-blue-500 bg-gray-800 text-white w-full'
                    id='password'
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    placeholder='Enter your password'
                    type="password"
                />
                <button
                    onClick={onSignup}
                    className={`p-2 rounded-lg m-2 focus:outline-none w-full ${buttonDisabled ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    type='submit'
                    disabled={buttonDisabled}
                >
                    {buttonDisabled ? "Fill in all details" : "Signup"}
                </button>
                <p className='mt-4 text-center'>
                    Already have an account? <Link href={'/login'} className='text-blue-500 hover:underline'>Login</Link>
                </p>
            </div>
        </div>
    )
}

export default SignupPage