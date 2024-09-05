import { connect } from '@/DB/dbConfig'
import User from '@/models/user.model'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { sendEmail } from '@/helpers/mailer'

// This is the route of: https://localhost:3000/api/users/signup

// In Next.js, we have to connect to the database every time we want to use it in a route.
connect()

// This is the route for the POST request to the /api/users/signup endpoint.
export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { username, email, password } = reqBody
        console.log(reqBody);
        // Validation for the required fields
        if (!username || !email || !password) {
            return NextResponse.json({error: 'Please fill in all fields'}, {status: 400})
        }

        // Check if the user already exists in the database
        const user = await User.findOne({ email })
        if (user) {
            return NextResponse.json({error: 'User already exists'}, {status: 400})
        }

        // Hash the password using bcryptjs
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        // Create a new user object
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        // Save the user to the database
        const savedUser = await newUser.save()
        console.log(savedUser);
        
        // Send Verification Email to the user
        await sendEmail({ email, emailType: "VERIFY_EMAIL", userID: savedUser._id })

        // Return the saved user object
        return NextResponse.json({
            message: 'User registered successfully',
            user: savedUser,
            success: true,
            status: 201
        })  
        
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
        
    }
}