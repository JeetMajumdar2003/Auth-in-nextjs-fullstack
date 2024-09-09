import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {

    // Get the path from the request
    const path = req.nextUrl.pathname;

    const isPublicPath = path === '/login' || path === '/signup' || path === '/verify-email' || path === '/reset-password';

    // Check if the user is authenticated
    const token = req.cookies.get('token')?.value;
    
    // go to the next middleware if the path is /verify-email and the user is authenticated
    if (path === '/verify-email' && token) {
        return NextResponse.next();
    }

    // Redirect to the profile page if the user is authenticated and tries to access a public path
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/profile', req.url));
    }

    if (!isPublicPath && !token) {
        // Redirect to login page if not authenticated
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Continue to the next middleware
    return NextResponse.next();
}

// Specify the paths where the middleware should be applied
export const config = {
    matcher: [
        '/',
        '/login',
        '/signup',
        '/verify-email',
        '/reset-password',
        '/profile',
    ],
};