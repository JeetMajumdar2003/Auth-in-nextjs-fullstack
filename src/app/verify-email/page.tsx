'use client'
import Link from 'next/link'
// import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

function VerifyEmailPage() {

    // const router = useRouter()

    // state variables
    const [token, setToken] = useState("")
    const [verified, setVerified] = useState(false)
    const [error, setError] = useState(false)

    // verify user email
    const verifyUserEmail = async () => {
        try {
            console.log('Starting email verification process...')
            const response = await fetch('/api/users/verifyemail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token })
            })
            if (!response.ok) {
                throw new Error('Verification failed: Server responded with a non-OK status')
            }
            const data = await response.json()
            console.log('Email verified successfully:', data)
            setVerified(true)
        } catch (error: any) {
            setError(true)
            console.error('Error during email verification:', error)
        }
    }

    // get token from url
    useEffect(() => {
        try {
            const urlParams = new URLSearchParams(window.location.search)
            const urlToken = urlParams.get('token')
            if (urlToken) {
                setToken(urlToken)
                console.log('Token extracted from URL:', urlToken)
            } else {
                console.warn('No token found in URL')
            }
        } catch (error) {
            console.error('Error extracting token from URL:', error)
        }

        // using nextjs router
        // const { query } = router
        // const urlToken2 = query.token
    }, [])

    // verify email on token change
    useEffect(() => {
        if (token.length > 0) {
            console.log('Token detected, initiating verification...')
            verifyUserEmail()
        }
    }, [token])

    return (
        <div className='flex flex-col items-center justify-center min-h-screen py-10 bg-gray-900'>
            <div className='bg-gray-800 shadow-md rounded-lg p-8 max-w-md w-full'>
                <h1 className='text-4xl font-bold mb-6 text-center text-white'>Verify Email</h1>
                <h2 className={`p-2 mb-4 text-center rounded break-words ${token ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {token ? `Token: ${token}` : "No Token found"}
                </h2>
                {verified && (
                    <div className='text-center'>
                        <h2 className='text-2xl font-semibold text-green-600 mb-4'>Verified Successfully!</h2>
                        <Link href={"/login"} className='text-blue-400 hover:underline'>
                            Go to Login
                        </Link>
                    </div>
                )}
                {error && (
                    <div className='text-center'>
                        <h2 className='text-2xl font-semibold text-red-600 mb-4'>Error in verification process</h2>
                        <p className='text-gray-400'>Please try again later or contact support.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default VerifyEmailPage