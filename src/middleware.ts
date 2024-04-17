import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req: NextRequestWithAuth) {
        if (String(req.nextUrl.pathname).includes('/administrator') && req.nextauth.token?.role !== 'Admin') {
            return NextResponse.rewrite(new URL('/404', req.url));
        } else{
            return NextResponse.rewrite(req.url)
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => {
                return token?.role === 'Admin'
            },
        },
    }
);

export const config = {
    matcher: [
      '/administrator_'
    ],
};
