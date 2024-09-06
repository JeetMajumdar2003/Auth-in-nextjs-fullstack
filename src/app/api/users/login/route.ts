import { connect } from '@/DB/dbConfig'
import User from '@/models/user.model'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendEmail } from '@/helpers/mailer'

// This is the route for the POST request to the /api/users/login endpoint.

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { email, password } = reqBody
        console.log(reqBody);

        // Validation for the required fields
        if (!email || !password) {
            return NextResponse.json({error: 'Please fill in all fields'}, {status: 400})
        }

        // Check if the user exists in the database
        const user = await User.findOne({ email })

        // If the user does not exist, return an error
        if (!user) {
            return NextResponse.json({error: 'Invalid credentials'}, {status: 400})
        }
        console.log("User found" + user);
        

        // Check if the password is correct
        const validPassword = await bcryptjs.compare(password, user.password)

        // If the password is incorrect, return an error
        if (!validPassword) {
            return NextResponse.json({error: 'Invalid Password'}, {status: 400})
        }

        // Create a JWT token
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }
        const tokenSecret = process.env.TOKEN_SECRET;
        if (!tokenSecret) {
            return NextResponse.json({ error: 'Token secret is not defined' }, { status: 500 });
        }
        const token = jwt.sign(tokenData, tokenSecret, { expiresIn: '1h' })

        // Return the token
        const response = NextResponse.json({
            message: 'Logged in successfully',
            success: true,
        })

        // Set the token in the cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            // sameSite: 'strict',
            // maxAge: 3600000
        })

        // Send mail to the user for successful login(Login Success email yet not implemented)
        // await sendEmail({ email, emailType: "LOGIN_SUCCESS", userID: user._id })

        return response;

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}