import { connect } from '@/DB/dbConfig'
import User from '@/models/user.model'
import { NextRequest, NextResponse } from 'next/server'

// This is the route for the POST request to the /api/users/verifyemail endpoint.

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { token } = reqBody
        console.log(token);

        // Validation for the required fields
        if (!token) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
        }

        // find a user with the verifyToken and verifyTokenExpiry fields
        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: Date.now() }  // Check if the token is still valid, here we are checking if the token expiry date is greater than($gt) the current date as we added 1hrs extra to the current date at the time of token generation(see the sendEmail function in the signup route)
        })

        if (!user) {
            return NextResponse.json({error: 'Invalid or expired token'}, {status: 400})
        }
        console.log(user);

        // Update the user's isVerified field to true
        user.isVerified = true;

        // Remove the verifyToken and verifyTokenExpiry fields
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        // Save the updated user object
        const savedUser = await user.save()

        // Return the saved user object
        return NextResponse.json({
            message: 'Email verified successfully',
            user: savedUser,
            success: true,
            status: 200
        })
        
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}