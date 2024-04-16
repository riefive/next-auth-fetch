import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthOptions } from 'next-auth';

const apiUrl = process.env.FAKE_API_REST ?? 'http://localhost:3000'

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
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
                if (!credentials) {
                    return null;
                }

                console.log(apiUrl)

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

                const token = await res.json();

                if (!token) return null

                const resProfile = await fetch(`${apiUrl}/v1/auth/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const user = await resProfile.json();

                if (!user) return null;
                return user;
            }
        })
    ],
    pages: {
        signIn: '/signin',
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
