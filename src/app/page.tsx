'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import AccessButton from './components/AccessButton';

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_FAKE_API_REST || 'http://localhost:3000';

  const { data: session, status } = useSession();
  console.log(session)
  console.log(status)

  useEffect(() => {
    async function getCategory() {
      const resCategory = await fetch(`${apiUrl}/v1/categories`, {
        method: 'GET'
      });
      console.log(resCategory)
    }

    if (status === 'loading') return

    getCategory()
  }, [apiUrl, status]);

  return (
    <div>
      <AccessButton />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <p>Hi, You Are Entering Next Auth Sample.</p>
      </main>
    </div>
  );
}
