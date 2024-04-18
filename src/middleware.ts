import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken, decode } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(request: NextRequest) {
    // const sessionToken = request.cookies.get('next-auth.session-token')?.value || '';
    const token = await getToken({ req: request, secret, raw: true })
    const decoded = await decode({ token, secret: secret as string })

    // console.log(sessionToken)
    // console.log(token)
    // console.log(decoded)

    if (!token || decoded?.role != 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
      '/administrator'
    ],
};
