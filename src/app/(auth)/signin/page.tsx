'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Login from '../../components/Login'

function SignInContent() {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl')

    return (
        <Login callbackUrl={callbackUrl} />
    )
}

export default function SignIn() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
           <SignInContent />
        </Suspense>
    )
};
