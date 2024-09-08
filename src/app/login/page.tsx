'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function LoginPage() {

    const router = useRouter()

    // state variables
    const [user, setUser] = useState({
        email: "",
        password: ""
    })
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [loading, setLoading] = useState(false)

    // login user
    const onLogin = async () => {
        setLoading(true)
        setButtonDisabled(true)
        try {
            const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
            })
            if (!response.ok) {
            throw new Error('Login failed')
            }
            const data = await response.json()
            console.log('Login successful', data)

            // redirect to
            router.push('/profile')
        } catch (error: any) {
            console.log("Login Failed! Try again later")
        } finally {
            setLoading(false)
            setButtonDisabled(false)
        }
    }

    // enable/disable button
    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }, [user])

    return (
        <div className='flex flex-col items-center justify-center min-h-screen py-2 bg-gray-900 text-white'>
            <div className='w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-md'>
                <h1 className='text-3xl font-bold mb-4 text-center'>{loading ? "Processing..." : "Login"}</h1>
                <hr className='border-gray-700 w-full mb-4' />
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
                    onClick={onLogin}
                    className={`p-2 rounded-lg m-2 focus:outline-none w-full ${buttonDisabled ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    type='submit'
                    disabled={buttonDisabled}
                >
                    {buttonDisabled ? "Fill in all details" : "Login"}
                </button>
                <p className='mt-4 text-center'>
                    Don't have an account? <Link href={'/signup'} className='text-blue-500 hover:underline'>Signup</Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage
