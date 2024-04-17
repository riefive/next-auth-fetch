import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'auth',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text',
                    placeholder: 'your@email.com',
                },
                password: {
                    label: 'Password',
                    type: 'password',
                },
            },
            authorize: async (credentials) => {
                const apiUrl = process.env.FAKE_API_REST || 'http://localhost:3000'

                if (!credentials) {
                    return null;
                }

                const { email, password } = credentials;

                const res = await fetch(`${apiUrl}/v1/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                    }),
                });

                const tokenRaw = await res.json();

                if (!tokenRaw) return null
                console.log(tokenRaw)
                console.log(tokenRaw?.message === 'Unauthorized')
                console.log(Number(tokenRaw?.statusCode || 0) === 401)
                if (tokenRaw?.message === 'Unauthorized' || Number(tokenRaw?.statusCode || 0) === 401) {
                    return {
                        error: tokenRaw?.message || 'Authentication Failed',
                        ok: false
                    } as any
                }

                const token = tokenRaw?.access_token

                const resProfile = await fetch(`${apiUrl}/v1/auth/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const user = await resProfile.json();

                if (!user) return null;

                return {
                    id: user?.id,
                    email: user?.email,
                    name: user?.name,
                    role: user?.role,
                    avatar: user?.avatar
                };
            }
        })
    ],
    pages: {
        signIn: '/signin',
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.AUTH_SECRET,
    callbacks: {
        session: ({ session, token }) => {
            if(session.user){
                return {
                    ...session,
                    user: {
                        ...session.user,
                        id: token.id,
                        role: token.role
                    },
                };
            }
            return session
            
        },
        jwt: ({ token, user }) => {
            if (user) {
                const u = user as unknown as any;
                return {
                    ...token,
                    id: u.id,
                    role: u.role
                };
            }
            return token;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
