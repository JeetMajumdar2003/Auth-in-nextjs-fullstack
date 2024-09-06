import { connect } from '@/DB/dbConfig'
import { NextRequest, NextResponse } from 'next/server'

// This is the route for the POST request to the /api/users/logout endpoint.

connect()   // DB connection

export async function GET(request: NextRequest) {
    try {
        // Return the response
        const response = NextResponse.json({
            message: 'Logged out successfully',
            success: true,
            status: 200
        })

        // Clear the token from the cookie
        response.cookies.set('token', '', {
            httpOnly: true,
            expires: new Date(0)
        })

        return response

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}
