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
                    access_token: token,
                    refresh_token: tokenRaw?.refresh_token
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
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        session: ({ session, trigger, newSession, token }) => {
            if (trigger === 'update' && newSession?.name) {
                console.log(newSession)
            }
            if (session.user) {
                return {
                    ...session,
                    user: {
                        ...session.user,
                        id: token.id,
                        role: token.role,
                        avatar: token.avatar,
                        access: token.access,
                        refresh: token.refresh
                    },
                };
            }
            return session
        },
        jwt: ({ user, token }) => {
            if (user) {
                const u = user as unknown as any;
                token.role = u.role,
                token.avatar = u.avatar,
                token.access = u.access_token;
                token.refresh = u.refresh_token;
            }
            return token;
        },
    },
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
