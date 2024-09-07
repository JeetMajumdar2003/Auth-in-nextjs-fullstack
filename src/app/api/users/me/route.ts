import { connect } from '@/DB/dbConfig'
import User from '@/models/user.model'
import { NextRequest, NextResponse } from 'next/server'
import { getDataFromToken } from '@/helpers/getDataFromToken'

// This is the route for the POST request to the /api/users/me endpoint.

connect()

export async function POST(request: NextRequest) {
    // Extract data from the Token
    const userID = await getDataFromToken(request)
    const user = await User.findOne({ _id: userID }).select('-password')

    // If the user is not found, return a 404 status code.
    if (!user) {
        return NextResponse.json(new Error('User not found'), { status: 404 })
    }

    // Return the user data
    return NextResponse.json({
        message: 'User data retrieved successfully',
        data: user,
    })
}