'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

type Props = {
    className?: string;
    callbackUrl?: string;
    error?: string;
};

const Login = (props: Props) => {
    const router = useRouter();
    const emailVal = useRef('');
    const passwordVal = useRef('');

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const res = await signIn('credentials', {
            email: emailVal.current,
            password: passwordVal.current,
            redirect: false,
            // redirect: true,
            // callbackUrl: '/',
        });

        if (!res) {
            console.log(res)
            return null
        }
    
        router.push(props.callbackUrl ?? 'http://localhost:3000');
    };

    return (
        <div className={props.className}>
            {!!props.error && (
                <p className="bg-red-100 text-red-600 text-center p-2">
                    Authentication Failed
                </p>
            )}
            <form onSubmit={onSubmit} className="p-2 flex flex-col gap-3">
                <div className="flex flex-col gap-2 mb-1">
                    <label>Email:</label>
                    <input type="text" id="email" name="email" onChange={(e) => (emailVal.current = e.target.value)} />
                </div>
                <div className="flex flex-col gap-2 mb-1">
                    <label>Password:</label>
                    <input type="password" id="password" name="password" onChange={(e) => (passwordVal.current = e.target.value)} />
                </div>
                <div className="flex items-center justify-center mt-2 gap-2">
                    <button type="submit" className="w-28">
                        Sign In
                    </button>
                    <Link
                        href={props.callbackUrl ?? "/"}
                        className="w-28 border border-red-600 text-center py-2 rounded-md text-red-600 transition hover:bg-red-600 hover:text-white hover:border-transparent active:scale-95"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    )
};

export default Login;

