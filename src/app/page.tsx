'use client';

import { useSession } from 'next-auth/react'

export default function Home() {
  const { data: session, status } = useSession()

  console.log(session)
  console.log(status)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
       <p>Hi, You Are Entering Next Auth Sample.</p>
    </main>
  );
}
