'use client'

import { useSearchParams } from 'next/navigation'
import Login from '../../components/Login'

export default function SignIn() {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl')

    return (
        <Login callbackUrl={callbackUrl} />
    )
};
