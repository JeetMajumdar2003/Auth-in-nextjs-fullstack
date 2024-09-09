'use client'

import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'

function FullProfilePage() {
    const router = useRouter()

    interface UserData {
        _id: string;
        username: string;
        email: string;
        bio?: string;
        location?: string;
        joinedDate?: string;
        isVerified: boolean;
        isAdmin: boolean;
        verifyToken?: string;
        verifyTokenExpiry?: string;
    }

    const [userData, setUserData] = useState({} as UserData)

    useEffect(() => {
        // Fetch full user details on page load
        getUserDetails()
    }, [])

    const getUserDetails = async () => {
        try {
            const response = await fetch('/api/users/me', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                console.error('Failed to fetch user data')
            }

            const data = await response.json()
            setUserData(data.data)
        } catch (error: any) {
            console.error('Failed to fetch user data')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
            <div className="container mx-auto py-12 px-6">
                <div className="bg-gray-800 shadow-lg rounded-xl p-8 max-w-3xl mx-auto space-y-8">
                    <h1 className="text-4xl font-extrabold text-center">Full Profile</h1>

                    {/* Profile Details */}
                    <div className="flex flex-col items-center space-y-6">
                        {/* User Avatar */}
                        <div className="relative w-32 h-32">
                            <img
                                className="rounded-full border-4 border-blue-500 shadow-xl"
                                src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=John&hair=short01,short02,short03,short04,short05`}
                                alt="User Avatar"
                            />
                        </div>

                        <div className="text-center space-y-2">
                            <p className="text-2xl font-bold">{userData.username || 'Loading...'}</p>
                            <p className="text-gray-400">{userData.email}</p>
                            <p className={`text-lg ${userData.isVerified ? 'text-green-500' : 'text-red-500'}`}>
                                {userData.isVerified ? 'Verified' : 'Not Verified'}
                            </p>
                            <p className="text-gray-300">
                                <span className="font-semibold">Admin: </span> {userData.isAdmin ? 'Yes' : 'No'}
                            </p>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="bg-gray-700 rounded-lg p-6 space-y-4">
                        {userData.bio && (
                            <p className="text-gray-300">
                                <span className="font-semibold">Bio: </span> {userData.bio}
                            </p>
                        )}
                        {userData.location && (
                            <p className="text-gray-300">
                                <span className="font-semibold">Location: </span> {userData.location}
                            </p>
                        )}
                        {userData.joinedDate && (
                            <p className="text-gray-300">
                                <span className="font-semibold">Joined: </span> {new Date(userData.joinedDate).toLocaleDateString()}
                            </p>
                        )}
                        {userData.verifyToken && !userData.isVerified && (
                            <p className="text-yellow-500 text-center">
                                A verification email has been sent to your inbox. Please check your email to verify your account.
                            </p>
                        )}
                        {userData.verifyTokenExpiry && !userData.isVerified && (
                            <p className="text-gray-300">
                                <span className="font-semibold">Token Expiry: </span> {new Date(userData.verifyTokenExpiry).toLocaleDateString()}
                            </p>
                        )}
                    </div>

                    {/* Profile Actions */}
                    <div className="flex flex-col space-y-4">
                        <button
                            type='button'
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
                            onClick={() => router.push('/profile')}
                        >
                            Back to Profile
                        </button>

                        <button
                            type='button'
                            className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300"
                            onClick={() => {
                                // Add delete account functionality if needed
                                alert('Delete Account functionality coming soon!')
                            }}
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FullProfilePage
