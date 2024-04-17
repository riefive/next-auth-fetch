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
                if (tokenRaw?.message === 'Unauthorized' || Number(tokenRaw?.statusCode || 0) === 401) {
                    throw new Error(JSON.stringify({ response: tokenRaw, status: false }));
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
                    avatar: user?.avatar,
                    token: token,
                    refresh: tokenRaw?.refresh_token
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
            if (session.user){
                return {
                    ...session,
                    user: {
                        ...session.user,
                        id: token.id,
                        role: token.role,
                        avatar: token.avatar,
                        token: token.token,
                        refresh: token.refresh
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
                    role: u.role,
                    avatar: u.avatar,
                    token: u.token,
                    refresh: u.refresh
                };
            }
            return token;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
