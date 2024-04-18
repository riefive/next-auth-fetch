'use client';

import { useSession } from 'next-auth/react';
import AccessButton from './components/AccessButton';

export default function Home() {
  const { data: session, status } = useSession()

  console.log(session)
  console.log(status)

  return (
    <div>
      <AccessButton />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <p>Hi, You Are Entering Next Auth Sample.</p>
      </main>
    </div>
  );
}
