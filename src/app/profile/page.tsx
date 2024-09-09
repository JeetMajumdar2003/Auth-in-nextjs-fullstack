'use client'

import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'

function ProfilePage() {
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
        // Fetch user details when the component loads
        getUserDetails()
    }, [])

    // Get user details function
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

    // Logout function
    const logout = async () => {
        try {
            const response = await fetch('/api/users/logout', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                console.error('Failed to logout')
            }

            router.push('/login')
        } catch (error: any) {
            console.error('Failed to logout')
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
            <div className="bg-gray-800 shadow-lg rounded-2xl p-8 max-w-lg w-full transform hover:scale-105 transition-transform duration-300">
                <h1 className="text-3xl font-extrabold mb-8 text-center text-white tracking-widest">
                    Your Profile
                </h1>

                {/* User Avatar */}
                <div className="flex justify-center mb-6">
                    <div className="relative w-24 h-24">
                        <img
                            className="rounded-full border-4 border-blue-500 shadow-xl"
                            src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=John&hair=short01,short02,short03,short04,short05`}
                            alt="User Avatar"
                        />
                    </div>
                </div>

                {/* Display user information */}
                <div className="text-center mb-6 space-y-4">
                    <p className="text-gray-300">
                        <span className="font-semibold">Name:</span> {userData.username || 'Loading...'}
                    </p>
                    <p className="text-gray-300">
                        <span className="font-semibold">Email:</span> {userData.email || 'Loading...'}
                    </p>
                    {userData.bio && (
                        <p className="text-gray-400 italic">
                            <span className="font-semibold">Bio:</span> {userData.bio}
                        </p>
                    )}
                    {userData.location && (
                        <p className="text-gray-300">
                            <span className="font-semibold">Location:</span> {userData.location}
                        </p>
                    )}
                    {userData.joinedDate && (
                        <p className="text-gray-300">
                            <span className="font-semibold">Joined:</span> {new Date(userData.joinedDate).toLocaleDateString()}
                        </p>
                    )}
                    <p className={`text-${userData.isVerified ? 'green' : 'red'}-500`}>
                        <span className="font-semibold">Account Status:</span> {userData.isVerified ? 'Verified' : 'Not Verified'}
                    </p>
                    <p className="text-gray-300">
                        <span className="font-semibold">Admin:</span> {userData.isAdmin ? 'Yes' : 'No'}
                    </p>

                    {!userData.isVerified && userData.verifyToken && (
                        <p className="text-gray-400">
                            Verification token expires on: {new Date(userData.verifyTokenExpiry || '').toLocaleDateString()}
                        </p>
                    )}
                </div>

                {/* Action buttons */}
                <div className="space-y-4">
                    {userData.isVerified || !userData.verifyToken ? (
                        <button
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500"
                            type="button"
                            onClick={() => router.push(`/profile/${userData._id}`)}
                        >
                            View Full Profile
                        </button>
                    ) : (
                        <p className="text-yellow-500 text-center">
                            A verification email has been sent to your inbox. Please check your email to verify your account.
                        </p>
                    )}

                    <button
                        className="w-full bg-gradient-to-r from-red-500 to-orange-600 text-white py-2 px-4 rounded-xl shadow-lg hover:from-red-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-red-500"
                        type="button"
                        onClick={logout}
                    >
                        Logout
                    </button>
                </div>

                {/* Settings Section */}
                <div className="mt-8 text-center">
                    <h2 className="text-xl font-semibold text-gray-200">Account Settings</h2>
                    <div className="flex flex-col items-center space-y-3 mt-4">
                        <button className="bg-gray-700 text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-600 w-full">
                            Edit Profile
                        </button>
                        <button className="bg-gray-700 text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-600 w-full">
                            Change Password
                        </button>
                        <button className="bg-gray-700 text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-600 w-full">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
